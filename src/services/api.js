import { default as time } from './time';
import { endpoints } from '../routes';
import buildCache from './cache';
import { getFeaturedItems } from './parsers';

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
        app.get(endpoints.singleAdvisor, this.get(this.getSingleAdvisor));
    }

    getAdvisors() {
        return new Promise((resolve, reject) => {
            buildCache().then(advisors => {
                resolve({
                    date: time.getCurrentDate(),
                    advisors: summariseAdvisors(advisors)
                });
            }).catch(error => reject(error));
        });
    }

    getSingleAdvisor(params) {
        return new Promise((resolve, reject) => {
            let loadAdvisor = () => {
                if (params && params.id) {
                    return buildCache().then(advisors => {
                        let advisor = advisors[params.id];
                        if (advisor) {
                            return {
                                id: params.id,
                                details: getAdvisorDetails(advisor)
                            };
                        }
                        else {
                            throw new Error('An invalid advisor identifier was provided.');
                        }
                    });
                }
                else {
                    throw new Error('No advisor identifier was provided.');
                }
            }
            loadAdvisor()
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
};

function summariseAdvisors(advisors) {
    let summaries = {};
    let categories = [];
    if (advisors) {
        for (let id in advisors) {
            let advisor = advisors[id];
            if (advisor && advisor.category) {
                summaries[id] = {
                    id: id,
                    name: advisor.name,
                    type: advisor.type,
                    icon: advisor.icon,
                    image: advisor.image,
                    expiresAt: advisor.expiresAt,
                    modifiers: reduceModifiers(advisor.modifiers),
                    items: getFeaturedItems(id, advisor.vendors)
                };

                let category = categories.find(p => p.id == advisor.category);
                if (category) {
                    category.advisors.push(id);
                }
                else {
                    categories.push({
                        id: advisor.category,
                        name: CATEGORIES[advisor.category] || advisor.category,
                        advisors: [id]
                    });
                }
            }
        }
    }
    return {
        summaries: summaries,
        categories: categories
    };
}

function reduceModifiers(modifiers) {
    if (!modifiers) return undefined;
    return modifiers.map(modifier => {
        return {
            name: modifier.name,
            icon: modifier.icon
        };
    });
}

function getAdvisorDetails(advisor) {
    return {
        rewards: advisor.rewards,
        modifiers: advisor.modifiers
    };
}

export default new APIService();