import dotenv from 'dotenv';
dotenv.config();
if (!process.env.BUNGIE_API_KEY) {
    console.error("The 'BUNGIE_API_KEY' environment variable has not been set.");
    process.exit(1);
}

import fs from 'fs';
import request from 'request';
import path from 'path';
import unzip from 'unzip';
import db from 'sqlite';

let bungie, getCurrencies, CURRENCIES, REWARDS = undefined;

const ITEMS_MANIFEST = 'build/gen/items.json';
const WORLD_DB_ZIP_PATH = 'manifest/world.sqlite.zip'
const WORLD_DB_PATH = 'manifest/world.sqlite';
const WORLD_DB_VERSION_PATH = 'manifest/version.txt';

function loadDependencies() {
    bungie = require('./build/services/bungie.js').default;
    getCurrencies = require('./build/services/parsers.js').getCurrencies;
    CURRENCIES = require('./build/services/parsers/rewards.js').CURRENCIES;
    REWARDS = require('./build/services/parsers/rewards.js').REWARDS;
}

export function verifyManifest() {
    loadDependencies();
    verifyCurrencyIcons();
    return verifyRewardDefinitions();
}

function verifyCurrencyIcons() {
    // verify icons are defined for all used currencies
    let currencies = getCurrencies();
    currencies.forEach(currency => {
        let icon = CURRENCIES[currency];
        if (!icon) {
            console.log(`No currency icon was defined for ${currency}`);
        }
    }, this);
}

function verifyRewardDefinitions() {
    return new Promise((resolve, reject) => {
        let itemHashes = getRewardItemHashes();

        let diffExistingManifest = items => {
            console.log('Found existing items manifest.');

            let loadDefinitions = null;
            let newItems = diffItemHashes(items, itemHashes);
            if (newItems.length === 0) {
                console.log('No new items added.');
                loadDefinitions = Promise.resolve(items);
            }
            else {
                console.log(`${newItems.length} new items added.`);
                loadDefinitions = retrieveWorldDB()
                    .then(database => {
                        return extractDefinitions(database, newItems);
                    })
                    .then(definitions => {
                        for (let hash in definitions) {
                            items[hash] = definitions[hash];
                        }
                        return items;
                    }).catch(error => {
                        console.log("Couldn't retrieve extra definitions:");
                        console.log(error.message);
                        return items;
                    });
            }

            return loadDefinitions
                .then(defs => writeManifest(itemHashes, defs))
                .then(() => resolve());
        };
        let createNewManifest = () => {
            console.log('Pre-existing items manifest not found.');
            if (itemHashes.length === 0) {
                console.log('No items within reward sets. Writing empty manifest...');
                return writeManifest(itemHashes, {})
                    .then(() => resolve());
            }
            else {
                console.log(`${itemHashes.length} unique items within reward sets.`);
                return retrieveWorldDB()
                    .then(database => {
                        return extractDefinitions(database, itemHashes);
                    })
                    .then(definitions => {
                        return writeManifest(itemHashes, definitions);
                    })
                    .then(() => resolve());
            }
        };

        loadItemsManifest()
            .then(diffExistingManifest)
            .catch(createNewManifest);
    });
}

function loadItemsManifest() {
    return new Promise((resolve, reject) => {
        fs.readFile(ITEMS_MANIFEST, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                let parsed = JSON.parse(data);
                if (parsed) {
                    resolve(parsed);
                } else {
                    reject(new Error('Items manifest data was invalid.'));
                }
            }
        });
    });
}

function getRewardItemHashes() {
    let itemHashes = [];
    for (let id in REWARDS) {
        let set = REWARDS[id];
        if (set.items) {
            set.items.forEach(hash => {
                if (!itemHashes.includes(hash)) {
                    itemHashes.push(hash);
                }
            }, this);
        }
    }
    return itemHashes;
}

function diffItemHashes(existing, itemHashes) {
    // extract item hashes from existing manifest
    let existingHashes = [];
    for (let hash in existing) {
        existingHashes.push(hash);
    }

    // determine newly added items
    let newItems = [];
    for (let i = 0; i < itemHashes.length; i++) {
        let hash = `${itemHashes[i]}`;
        if (!existingHashes.includes(hash)) {
            if (!newItems.includes(hash)) {
                newItems.push(hash);
            }
        }
    }
    return newItems;
}

function retrieveWorldDB() {
    console.log('Retrieving Bungie manifest...');
    return bungie.getManifest().then(response => {
        if (response && response.mobileWorldContentPaths
            && response.mobileWorldContentPaths.en) {
            console.log('Bungie manifest retrieved.');

            let downloadDB = () =>
                downloadDatabase(response.mobileWorldContentPaths.en)
                    .then(unzipDatabase)
                    .then(connectToDB)
                    .catch(error => Promise.reject(error));

            let latestVersion = path.basename(
                response.mobileWorldContentPaths.en);
            return isLocalDBLatest(latestVersion)
                .then(connectToDB)
                .catch(downloadDB);
        }
        return Promise.reject(
            new Error('Bungie manifest was invalid.'));
    }).catch(error => {
        console.log("Couldn't download Bungie manifest:");
        console.log(error.message);
        return Promise.reject(error);
    });
}

function isLocalDBLatest(latestVersion) {
    return new Promise((resolve, reject) => {
        fs.readFile(WORLD_DB_VERSION_PATH, 'utf8', (error, data) => {
            if (error) {
                console.log("Couldn't determine local DB version.");
                reject(error);
            }
            else if (data === latestVersion) {
                console.log('Local DB is the latest version.');
                resolve(WORLD_DB_PATH);
            } else {
                console.log('Local DB is not the latest version.');
                reject(new Error('Local DB is not the latest version.'));
            }
        });
    });
}

function downloadDatabase(relativeURL) {
    return new Promise((resolve, reject) => {
        let url = `https://www.bungie.net${relativeURL}`;
        let version = path.basename(relativeURL);

        console.log(`Downloading world database from '${url}'...`);
        ensureDirectoryExists(WORLD_DB_ZIP_PATH);
        request
            .get(url)
            .on('error', error => reject(error))
            .pipe(fs.createWriteStream(WORLD_DB_ZIP_PATH))
            .on('close', () => {
                console.log('World database downloaded.');
                resolve({
                    path: WORLD_DB_ZIP_PATH,
                    version: version
                });
            });
    });
}

function unzipDatabase({path, version}) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .on('error', error => reject(error))
            .pipe(unzip.Parse())
            .on('entry', entry => {
                entry
                    .pipe(fs.createWriteStream(WORLD_DB_PATH))
                    .on('close', () => {
                        console.log('World database unzipped.');
                        fs.writeFile(WORLD_DB_VERSION_PATH, version, error => {
                            if (error) {
                                console.log('version.txt could not be updated:');
                                console.log(error.message);
                            }
                            else {
                                console.log(`version.txt updated to '${version}'.`);
                            }
                            resolve(WORLD_DB_PATH);
                        });
                    });
            });
    });
}

function connectToDB(path) {
    return new Promise((resolve, reject) => {
        db.open(path)
            .then(database => resolve(database))
            .catch(error => {
                console.log(`Couldn't connect to database '${path}':`);
                console.log(error.message);
                reject(error);
            });
    });
}

function extractDefinitions(db, itemHashes) {
    // build query
    let hashes = itemHashes.map(hash => hash >> 0);
    let placeholder = hashes.map(() => '?').join();
    let query = `SELECT json FROM DestinyInventoryItemDefinition WHERE id IN (${placeholder});`;

    return db.all(query, hashes)
        .then(parseDefinitions)
        .catch(error => {
            console.log('Could not retrieve definitions from database:');
            console.log(error.message);
            return Promise.reject(error);
        });
}

function parseDefinitions(rows) {
    if (rows) {
        console.log(`Retrieved ${rows.length} definitions from database.`);
        let output = {};
        rows.forEach(row => {
            let json = JSON.parse(row.json);
            output[json.itemHash] = {
                hash: json.itemHash,
                name: json.itemName,
                type: json.itemTypeName,
                icon: `https://www.bungie.net${json.icon}`
            };
        }, this);
        return output;
    }
    else {
        return {};
    }
}

function writeManifest(itemHashes, definitions = null) {
    return new Promise((resolve, reject) => {
        // generate manifest
        let items = generateItemManifest(itemHashes, definitions);
        let manifest = JSON.stringify(items);
        console.log('Manifest generated.');

        // export manifest
        ensureDirectoryExists(ITEMS_MANIFEST);
        fs.writeFile(ITEMS_MANIFEST, manifest, error => {
            if (error) {
                console.log("Couldn't save generated items manifest.");
                reject(error);
            }
            else {
                console.log(`Saved generated items manifest to '${ITEMS_MANIFEST}'`);
                resolve();
            }
        });
    });
}

function generateItemManifest(itemHashes, existing = null) {
    let items = {};
    itemHashes.forEach(hash => {
        if (existing) {
            items[hash] = existing[hash];
        }
        items[hash] = items[hash] || {
            hash: hash,
            name: 'Item Name',
            type: 'Item Type',
            icon: '/images/ui/unknownItem.png'
        };
    }, this);
    return items;
}

function ensureDirectoryExists(path) {
    let directories = path.split('/');
    if (directories.length > 1) {
        let current = directories[0];
        for (let i = 1; i < directories.length; i++) {
            if (!fs.existsSync(current)) {
                fs.mkdirSync(current);
            }
            current = `${current}/${directories[i]}`;
        }
    }
}

// function verifyRewardDefinitions() {
//     // build list of item hashes
//     let itemHashes = [];
//     for (let id in REWARDS) {
//         let set = REWARDS[id];
//         if (set.items) {
//             set.items.forEach(hash => {
//                 if (!itemHashes.includes(hash)) {
//                     itemHashes.push(hash);
//                 }
//             }, this);
//         }
//     }
//     console.log(`${itemHashes.length} unique items within reward sets.`);

//     try {
//         // load existing manifest
//         let data = fs.readFileSync(ITEMS_MANIFEST);

//         console.log('Found existing items manifest.');
//         let existing = JSON.parse(data);
//         if (existing) {
//             performManifestDiff(existing, itemHashes);
//         }
//         else {
//             console.log("Existing manifest was invalid.");
//             writeManifest(itemHashes);
//         }
//     } catch (error) {
//         console.log('Pre-existing items manifest not found.');
//         writeManifest(itemHashes);
//     }
// }

// function performManifestDiff(existing, itemHashes) {
//     // extract item hashes from existing manifest
//     let existingHashes = [];
//     for (let hash in existing) {
//         existingHashes.push(hash);
//     }

//     // determine newly added items
//     let newItems = [];
//     for (let i = 0; i < itemHashes.length; i++) {
//         let hash = `${itemHashes[i]}`;
//         if (!existingHashes.includes(hash)) {
//             if (!newItems.includes(hash)) {
//                 newItems.push(hash);
//             }
//         }
//     }
//     if (newItems.length === 0) {
//         console.log('No new items added.');
//     }
//     else {
//         console.log(`${newItems.length} new items added.`);

//         bungie.getManifest().then(data => {
//             console.log(data);
//         }).catch(error => {
//             console.log("Couldn't download Bungie manifest.");
//         });
//     }

//     // export new manifest
//     // writeManifest(itemHashes, existing);
// }

// function writeManifest(itemHashes, existing = null) {
//     let items = generateItemManifest(itemHashes, existing);

//     ensureDirectoryExists(ITEMS_MANIFEST);
//     try {
//         fs.writeFileSync(ITEMS_MANIFEST, JSON.stringify(items));
//         console.log(`Saved generated items manifest to '${ITEMS_MANIFEST}'`);
//     } catch (error) {
//         console.log(`Couldn't save generated items manifest (${error})`);
//     }
// }
