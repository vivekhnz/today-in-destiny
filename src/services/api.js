import { default as time } from './time';
import { endpoints } from '../routes';
import { default as bungie } from './bungie';
import ManifestService from './manifest';
import AdvisorsService from './advisors';

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
            bungie.getPublicAdvisorsV2()
                .then(response => {
                    if (response && response.data && response.data.activities) {
                        return {
                            activities: response.data.activities,
                            definitions: [response.definitions]
                        };
                    }
                    else {
                        throw new Error('No advisors returned.');
                    }
                })
                .then(response => {
                    let xur = response.activities.xur;
                    if (xur && xur.status && xur.status.active) {
                        return this.getXur(response);
                    }
                    return response;
                })
                .then(response => {
                    try {
                        resolve(this.parseAdvisors(response));
                    } catch (error) {
                        throw error;
                    }
                }).catch(error => {
                    console.log(error);
                    reject(new Error("An error occurred while fetching advisors."));
                });
        });
    }

    getXur(response) {
        return new Promise((resolve, reject) => {
            bungie.getXur()
                .then(xur => {
                    if (xur && xur.data && xur.data.saleItemCategories) {
                        response.definitions.push(xur.definitions);
                        response.xur = this.parseXurStock(
                            xur.data.saleItemCategories);
                        resolve(response);
                    }
                    else {
                        throw new Error('No Xur data returned.');
                    }
                }).catch(error => {
                    console.log(error);
                    reject(new Error("An error occurred while fetching Xur's stock."));
                });
        });
    }

    parseXurStock(data) {
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

    parseAdvisors(response) {
        let definitions = this.combineDefinitions(response.definitions);
        let manifest = new ManifestService(definitions);
        let service = new AdvisorsService(
            response.activities, response.xur, manifest);
        let advisors = service.getAdvisors();
        let categories = this.groupByCategory(advisors);
        return {
            date: time.getCurrentDate(),
            advisorGroups: categories
        };
    }

    combineDefinitions(collection) {
        let output = {};
        collection.forEach(definitions => {
            for (let type in definitions) {
                let existing = output[type];
                let defs = definitions[type];
                if (existing) {
                    output[type] = this.merge(existing, defs);
                }
                else {
                    output[type] = defs;
                }
            }
        }, this);
        return output;
    }

    merge(a, b) {
        for (let key in b) {
            a[key] = b[key];
        }
        return a;
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