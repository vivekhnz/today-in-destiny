import fs from 'fs';
import { getCurrencies } from './build/services/parsers.js';
import { CURRENCIES, REWARDS } from './build/services/parsers/rewards.js';

const ITEMS_MANIFEST = 'build/gen/items.json';

export function verifyManifest() {
    verifyCurrencyIcons();
    verifyRewardDefinitions();
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
    // build list of item hashes
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
    console.log(`${itemHashes.length} unique items within reward sets.`);

    try {
        // load existing manifest
        let data = fs.readFileSync(ITEMS_MANIFEST);

        console.log('Found existing items manifest.');
        let existing = JSON.parse(data);
        if (existing) {
            performManifestDiff(existing, itemHashes);
        }
        else {
            console.log("Existing manifest was invalid.");
            writeManifest(itemHashes);
        }
    } catch (error) {
        console.log('Pre-existing items manifest not found.');
        writeManifest(itemHashes);
    }
}

function performManifestDiff(existing, itemHashes) {
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
    console.log(`${newItems.length} new items added.`);

    // export new manifest
    writeManifest(itemHashes, existing);
}

function writeManifest(itemHashes, existing = null) {
    let items = generateItemManifest(itemHashes, existing);
    
    ensureDirectoryExists(ITEMS_MANIFEST);
    try {
        fs.writeFileSync(ITEMS_MANIFEST, JSON.stringify(items));
        console.log(`Saved generated items manifest to '${ITEMS_MANIFEST}'`);
    } catch (error) {
        console.log(`Couldn't save generated items manifest (${error})`);
    }
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