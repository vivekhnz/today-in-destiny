import fs from 'fs';
import memcache from 'memory-cache';
import { default as bungie } from './bungie';
import { default as time } from './time';
import ManifestService from './manifest';
import {
    getVendorDependencies,
    getOptionalVendorDependencies,
    parse
} from './parsers';

const ITEMS_MANIFEST = 'build/gen/items.json';

let VENDORS = {
    xur: {
        hash: 2796397637,
        name: 'Xûr'
    },
    efrideet: {
        hash: 2610555297,
        name: 'Lady Efrideet'
    },
    tyra: {
        hash: 2190824863,
        name: 'Tyra Karn'
    },
    shiro: {
        hash: 2190824860,
        name: 'Shiro-4'
    }
}

const ADVISORS_CACHE_ID = 'advisors-cache';
const MAXIMUM_CACHE_MILLISECONDS = 900000; // 15 minutes

export default function getCache() {
    // attempt to retrieve cached data
    let cached = memcache.get(ADVISORS_CACHE_ID);
    if (cached) {
        // determine how old the cached data is
        let elapsed = time.getElapsedMilliseconds(cached.generatedAt);

        // is this data stale?
        if (elapsed > MAXIMUM_CACHE_MILLISECONDS) {
            // data is too old, retrieve new data
            return regenerateCache();
        }
        else {
            // data is still valid
            return Promise.resolve(cached);
        }
    }
    else {
        // if we can't find a cached version, regenerate the cache
        return regenerateCache();
    }
}

function regenerateCache() {
    // clear cache
    memcache.del(ADVISORS_CACHE_ID);

    // retrieve new data
    return buildCache().then(newData => {
        // cache the fresh data
        memcache.put(ADVISORS_CACHE_ID, newData);
        return newData;
    }).catch(error => reject(error));
}

function buildCache() {
    return new Promise((resolve, reject) => {
        let definitions = [];
        let activities = null;
        let vendors = {};
        let items = {};

        let loadAdvisors = () => {
            return bungie.getPublicAdvisorsV2()
                .then(response => {
                    if (response && response.data && response.data.activities) {
                        definitions.push(response.definitions);
                        activities = response.data.activities;
                        return response.data.activities;
                    }
                    else {
                        console.log('No advisors returned.');
                        throw new Error("An error occurred while fetching advisors.");
                    }
                })
        };
        let loadVendor = vendorID => {
            let definition = VENDORS[vendorID];
            return bungie.getVendor(definition.hash)
                .then(vendor => {
                    if (vendor && vendor.data && vendor.data.saleItemCategories) {
                        definitions.push(vendor.definitions);
                        vendors[vendorID] = {
                            name: definition.name,
                            refreshesAt: vendor.data.nextRefreshDate,
                            stock: parseVendorStock(
                                vendor.data.saleItemCategories)
                        };
                    }
                    else {
                        console.log(`No vendor data returned from ${vendorID}.`);
                    }
                })
                .catch(error => {
                    console.log(`No vendor data returned from ${vendorID}.`);
                });
        };
        let loadVendors = () => {
            let advisorVendors = getVendorDependencies();
            return Promise.all(
                advisorVendors.map(id => loadVendor(id)));
        };
        let loadEventVendors = activities => {
            let advisorVendors = getOptionalVendorDependencies(activities);
            return Promise.all(
                advisorVendors.map(id => loadVendor(id)));
        };
        let loadItemsManifest = () => {
            return new Promise((resolve, reject) => {
                fs.readFile(ITEMS_MANIFEST, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(data);
                    }
                });
            }).then(data => {
                items = JSON.parse(data);
                return items;
            })
                .catch(error => {
                    console.log("Couldn't load items manifest.");
                });
        }
        let parseAdvisors = () => {
            let manifest = new ManifestService(
                combineDefinitions(definitions));
            let advisors = parse(activities, vendors, manifest, items);
            resolve({
                generatedAt: new Date(),
                date: time.getCurrentDate(),
                advisors: advisors
            });
        };

        Promise.all([
            loadAdvisors().then(loadEventVendors),
            loadVendors(),
            loadItemsManifest()
        ])
            .then(parseAdvisors)
            .catch(error => reject(error));
    });
};

function parseVendorStock(data) {
    let stock = {};
    data.forEach(category => {
        stock[category.categoryTitle] =
            category.saleItems.map(sale => {
                return {
                    itemHash: sale.item.itemHash,
                    quantity: sale.item.stackSize,
                    costs: sale.costs,
                    primaryStat: sale.item.primaryStat,
                    stats: sale.item.stats,
                    perks: sale.item.perks
                };
            })
    }, this);
    return stock;
}

function combineDefinitions(collection) {
    let output = {};
    if (collection) {
        collection.forEach(definitions => {
            for (let type in definitions) {
                let existing = output[type];
                let defs = definitions[type];
                if (existing) {
                    for (let key in defs) {
                        output[type][key] = defs[key];
                    }
                }
                else {
                    output[type] = defs;
                }
            }
        }, this);
    }
    return output;
}