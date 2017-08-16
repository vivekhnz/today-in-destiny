import { endpoints } from '../routes';
import getCache from './cache';
import { getFeaturedItemSummaries, getStock } from './parsers';

const CATEGORIES = {
    activities: 'Activities',
    events: 'Events',
    weekly: 'This Week',
    vendors: 'Vendors'
};

const REFRESH_TOKEN_HEADER = 'x-refresh-token';

class APIService {
    get(promise) {
        return (req, res) => {
            promise.bind(this)(req.params, req.query, req.headers)
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
        app.get(endpoints.categoryAdvisor, this.get(this.getCategoryAdvisor));
    }

    getAdvisors(params, query, headers) {
        return new Promise((resolve, reject) => {
            getCache(this.shouldForceRefresh(query, headers)).then(cache => {
                resolve({
                    date: cache.date,
                    categories: summariseAdvisors(
                        cache.categories, cache.advisors),
                    categoryMap: cache.categories
                });
            }).catch(error => reject(error));
        });
    }

    getSingleAdvisor(params, query, headers) {
        return new Promise((resolve, reject) => {
            let loadAdvisor = () => {
                if (params && params.id) {
                    return getCache(this.shouldForceRefresh(query, headers)).then(cache => {
                        let advisor = cache.advisors[params.id];
                        if (advisor) {
                            return {
                                id: params.id,
                                details: getAdvisorDetails(params.id, advisor)
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

    getCategoryAdvisor(params, query, headers) {
        return new Promise((resolve, reject) => {
            let loadAdvisor = () => {
                if (params && params.category && params.id) {
                    return getCache(this.shouldForceRefresh(query, headers)).then(cache => {
                        let category = cache.categories[params.category];
                        if (category) {
                            let advisorID = category[params.id];
                            if (advisorID) {
                                return this.getSingleAdvisor({ id: advisorID });
                            }
                            else {
                                throw new Error('An invalid advisor identifier was provided.');
                            }
                        }
                        else {
                            throw new Error('An invalid activity category was provided.');
                        }
                    });
                }
                else {
                    throw new Error('No activity category or advisor identifier was provided.');
                }
            }
            loadAdvisor()
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    shouldForceRefresh(query, headers) {
        if (query && query.refresh !== 'true') {
            // force refresh was not requested
            return false;
        }
        if (!process.env.API_REFRESH_TOKEN) {
            // no API refresh token was configured, force refresh is not supported
            return false;
        }
        if (headers && process.env.API_REFRESH_TOKEN !== headers[REFRESH_TOKEN_HEADER]) {
            // incorrect refresh token
            return false;
        }
        return true;
    }
};

function summariseAdvisors(categories, advisors) {
    let output = [];
    if (categories && advisors) {
        for (let categoryID in categories) {
            let category = categories[categoryID];
            let summaries = [];
            for (let advisorID in category) {
                let id = category[advisorID];
                let advisor = advisors[id];
                if (advisor) {
                    summaries.push({
                        id: id,
                        shortID: advisorID,
                        name: advisor.name,
                        type: advisor.type,
                        icon: advisor.icon,
                        image: advisor.image,
                        expiresAt: advisor.expiresAt,
                        modifiers: reduceModifiers(advisor.modifiers),
                        items: getFeaturedItemSummaries(id, advisor.vendors)
                    });
                }
            }
            output.push({
                id: categoryID,
                name: CATEGORIES[categoryID] || categoryID,
                advisors: summaries
            });
        }
    }
    return output;
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

function getAdvisorDetails(id, advisor) {
    let stock = advisor.vendors ?
        getStock(id, advisor.vendors) : undefined;
    return {
        rewards: advisor.rewards,
        modifiers: advisor.modifiers,
        stock: stock
    };
}

export default new APIService();