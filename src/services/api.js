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
                        try {
                            let manifest = new ManifestService(
                                response.definitions);
                            let service = new AdvisorsService(
                                response.data.activities, manifest);
                            let advisors = service.getAdvisors();
                            let categories = this.groupByCategory(advisors);
                            resolve({
                                date: time.getCurrentDate(),
                                advisorGroups: categories
                            });
                        } catch (error) {
                            throw error;
                        }
                    }
                    else {
                        throw new Error('No advisors returned.');
                    }
                }).catch(error => {
                    console.log(error);
                    reject(new Error("An error occurred while fetching advisors."));
                });
        });
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