import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
if (!process.env.BUNGIE_API_KEY) {
    console.error("The 'BUNGIE_API_KEY' environment variable has not been set.");
    process.exit(1);
}

import fs from 'fs';
import request from 'request';
import path from 'path';
import unzip from 'unzip';
import db from 'sqlite';
import imagemin from 'imagemin';
import { default as jpegtran } from 'imagemin-jpegtran';
import rimraf from 'rimraf';

let bungie, getCurrencies, CURRENCIES, REWARDS = undefined;

const ITEMS_MANIFEST = 'build/gen/items.json';
const WORLD_DB_ZIP_PATH = 'tmp/world.sqlite.zip'
const WORLD_DB_PATH = 'manifest/world.sqlite';
const WORLD_DB_VERSION_PATH = 'manifest/version.txt';
const RAW_ITEM_ICONS_PATH = 'tmp/items/';
const ITEM_ICONS_PATH_RELATIVE = '/images/items/';
const ITEM_ICONS_PATH_ABSOLUTE = 'build/public/images/items';
const TEMP_DIR = 'tmp';

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
                    .then(database => extractDefinitions(database, newItems))
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
                .then(cleanup)
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
                    .then(database => extractDefinitions(database, itemHashes))
                    .then(definitions => writeManifest(itemHashes, definitions))
                    .then(cleanup)
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
        console.log('Attempting to load existing DB...');
        return connectToDB(WORLD_DB_PATH);
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
        ensureDirectoryExists(WORLD_DB_PATH);
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
        .then(downloadIcons)
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
                icon: `https://www.bungie.net${json.icon}`,
                tier: json.tierTypeName
            };
        }, this);
        return output;
    }
    else {
        return {};
    }
}

function downloadIcons(definitions) {
    let definitionArray = [];
    for (let hash in definitions) {
        definitionArray.push(definitions[hash]);
    }

    if (definitionArray.length === 0) {
        console.log('No icons to download.');
        return {};
    }

    console.log('Downloading icons...');
    ensureDirectoryExists(`${RAW_ITEM_ICONS_PATH}*`);
    return Promise
        .all(definitionArray.map(downloadIcon))
        .then(compressIcons)
        .then(definitions => {
            let output = {};
            definitions.forEach(definition => {
                output[definition.hash] = definition;
            }, this);
            if (definitions.length === definitionArray.length) {
                console.log(`All icons (${definitions.length}) downloaded successfully.`);
            }
            else {
                console.log(`${definitions.length} / ${definitionArray.length} were downloaded.`);
            }
            return output;
        });
}

function downloadIcon(definition) {
    return new Promise((resolve, reject) => {
        let filename = `${definition.hash}.jpg`;
        let outputPathRelative = `${ITEM_ICONS_PATH_RELATIVE}${filename}`;
        let outputPathAbsolute = `${RAW_ITEM_ICONS_PATH}${filename}`;
        request
            .get(definition.icon)
            .on('error', error => resolve(null))
            .pipe(fs.createWriteStream(outputPathAbsolute))
            .on('close', () => {
                definition.icon = outputPathRelative;
                resolve(definition);
            });
    });
}

function compressIcons(results) {
    let output = [];
    let inputPaths = [];
    results.forEach(result => {
        if (result) {
            inputPaths.push(`${RAW_ITEM_ICONS_PATH}${result.hash}.jpg`);
            output.push(result);
        }
    }, this);

    let config = { plugins: [jpegtran()] };
    return imagemin(inputPaths, ITEM_ICONS_PATH_ABSOLUTE, config)
        .then(() => output);
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
    if (existing) {
        itemHashes.forEach(hash => {
            let definition = existing[hash];
            if (definition) {
                items[hash] = definition;
            }
        }, this);
    }
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

function cleanup() {
    return new Promise((resolve, reject) => {
        rimraf(TEMP_DIR, error => {
            if (error) {
                console.log("Couldn't delete temp folder:");
                console.log(error);
            }
            else {
                console.log('Deleted temp folder.');
            }
            resolve();
        });
    });
}