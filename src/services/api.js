import { default as time } from './time';
import { endpoints } from '../routes';
import { default as bungie } from './bungie';
import ManifestService from './manifest';
import AdvisorsService from './advisors';

let VENDORS = {
    xur: 2796397637,
    ironBanner: 2610555297
}

class APIService {
    get(promise) {
        return (req, res) => {
            promise.bind(this)()
                .then(result => res.send({
                    response: result,
                    status: 'Success'
                }))
                .catch(error => res.status(500).send({
                    response: null,
                    status: error.message
                }));
        };
    }

    registerEndpoints(app) {
        app.get(endpoints.advisors, this.get(this.getAdvisors));
    }

    getAdvisors() {
        return new Promise((resolve, reject) => {
            let definitions = [];
            let activities = null;
            let vendors = {};

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
                            vendors[vendorID] = this.parseVendorStock(
                                vendor.data.saleItemCategories);
                        }
                        else {
                            console.log(`No vendor data returned from ${vendorID}.`);
                        }
                    });
            };
            let loadEventVendors = activities => {
                let promises = [];

                let eventVendors = {
                    'xur': VENDORS.xur,
                    'ironbanner': VENDORS.ironBanner
                };
                for (let id in eventVendors) {
                    let advisor = activities[id];
                    if (advisor && advisor.status && advisor.status.active) {
                        promises.push(loadVendor(id, eventVendors[id]));
                    }
                }

                return Promise.all(promises);
            };
            let parseAdvisors = () => {
                let manifest = new ManifestService(
                    this.combineDefinitions(definitions));
                let service = new AdvisorsService(
                    activities, vendors, manifest);
                let advisors = service.getAdvisors();
                let categories = this.groupByCategory(advisors);
                resolve({
                    date: time.getCurrentDate(),
                    advisorGroups: categories,
                });
            }
            loadAdvisors()
                .then(loadEventVendors)
                .then(parseAdvisors)
                .catch(error => reject(error));
        });
    }

    parseVendorStock(data) {
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

    combineDefinitions(collection) {
        let output = {};
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
        return output;
    }

    groupByCategory(advisors) {
        let categories = [];
        if (advisors) {
            advisors.forEach(advisor => {
                if (advisor && advisor.category) {
                    let category = categories.find(p => p.name == advisor.category);
                    if (category) {
                        category.advisors.push(advisor);
                    }
                    else {
                        categories.push({
                            name: advisor.category,
                            advisors: [advisor]
                        });
                    }
                }
            }, this);
        }
        return categories;
    }
};

export default new APIService();