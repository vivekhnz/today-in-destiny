import fs from 'fs';
import { default as bungie } from './bungie';
import ManifestService from './manifest';
import {
    getVendorDependencies,
    getOptionalVendorDependencies,
    parse
} from './parsers';

const ITEMS_MANIFEST = 'build/gen/items.json';

let VENDORS = {
    xur: 2796397637,
    efrideet: 2610555297,
    tyra: 2190824863,
    shiro: 2190824860
}

export default function buildCache() {
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
        let loadVendor = (vendorID, vendorHash) => {
            return bungie.getVendor(vendorHash)
                .then(vendor => {
                    if (vendor && vendor.data && vendor.data.saleItemCategories) {
                        definitions.push(vendor.definitions);
                        vendors[vendorID] = {
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
                advisorVendors.map(id => loadVendor(id, VENDORS[id])));
        };
        let loadEventVendors = activities => {
            let advisorVendors = getOptionalVendorDependencies(activities);
            return Promise.all(
                advisorVendors.map(id => loadVendor(id, VENDORS[id])));
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
            resolve(parse(activities, vendors, manifest, items));
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
                    costs: sale.costs
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