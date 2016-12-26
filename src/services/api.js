import { default as time } from './time';
import { endpoints } from '../routes';
import { default as bungie } from './bungie';
import ManifestService from './manifest';
import { getVendorDependencies, getOptionalVendorDependencies, parse } from './parsers';

let VENDORS = {
    xur: 2796397637,
    efrideet: 2610555297,
    tyra: 2190824863,
    shiro: 2190824860
}

let CATEGORIES = {
    activities: 'Activities',
    events: 'Events',
    daily: 'Today',
    weekly: 'This Week'
}

class APIService {
    get(promise) {
        return (req, res) => {
            promise.bind(this)(req.params)
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
        app.get(endpoints.activity, this.get(this.getActivity));
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
                            vendors[vendorID] = {
                                refreshesAt: vendor.data.nextRefreshDate,
                                stock: parseVendorStock(
                                    vendor.data.saleItemCategories)
                            };
                        }
                        else {
                            console.log(`No vendor data returned from ${vendorID}.`);
                        }
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
            let parseAdvisors = () => {
                let manifest = new ManifestService(
                    combineDefinitions(definitions));
                let advisors = parse(activities, vendors, manifest);
                resolve({
                    date: time.getCurrentDate(),
                    advisorGroups: groupByCategory(advisors)
                });
            };

            Promise.all([
                loadAdvisors().then(loadEventVendors),
                loadVendors()
            ])
                .then(parseAdvisors)
                .catch(error => reject(error));
        });
    }

    getActivity(params) {
        return new Promise((resolve, reject) => {
            let loadActivity = () => {
                if (params && params.id) {
                    return bungie.getPublicAdvisorsV2()
                        .then(response => {
                            if (response && response.data && response.data.activities) {
                                let activity = response.data.activities[params.id];
                                if (activity) {
                                    let activities = {};
                                    activities[params.id] = activity;
                                    return {
                                        activities: activities,
                                        definitions: response.definitions
                                    }
                                }
                            }
                            console.log('No advisors returned.');
                            throw new Error("An error occurred while fetching advisors.");
                        });
                }
                else {
                    throw new Error('No activity identifier was provided.');
                }
            };
            let parseActivity = response => {
                let manifest = new ManifestService(response.definitions);
                let advisors = parse(response.activities, null, manifest);
                if (advisors && advisors.length > 0) {
                    resolve({
                        date: time.getCurrentDate(),
                        activity: advisors[0]
                    });
                }
                else {
                    throw new Error('Could not parse any advisors.');
                }
            }
            loadActivity()
                .then(parseActivity)
                .catch(error => reject(error))
        });
    }
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

function groupByCategory(advisors) {
    let categories = [];
    if (advisors) {
        advisors.forEach(advisor => {
            if (advisor && advisor.category) {
                let category = categories.find(p => p.id == advisor.category);
                if (category) {
                    category.advisors.push(advisor);
                }
                else {
                    categories.push({
                        id: advisor.category,
                        name: CATEGORIES[advisor.category] || advisor.category,
                        advisors: [advisor]
                    });
                }
            }
        }, this);
    }
    return categories;
}

export default new APIService();