import time from './time';
import { bnet } from './parsers/utils';
import { default as parseXur } from './parsers/xur';
import { default as parseTrials } from './parsers/trials';
import { default as parseIronBanner } from './parsers/ironBanner';
import { parseDailyStory, parseNightfall, parseHeroicStrikes } from './parsers/missions';
import { parseDailyCrucible, parseWeeklyCrucible } from './parsers/crucible';
import { parseWrathOfTheMachine, parseKingsFall } from './parsers/raids';
import { parseIronLordArtifacts, parseShiro } from './parsers/vendors';

let ADVISOR_PARSERS = {
    'xur': parseXur,
    'trials': parseTrials,
    'ironBanner': parseIronBanner,
    'dailyStory': parseDailyStory,
    'dailyCrucible': parseDailyCrucible,
    'wrathOfTheMachine': parseWrathOfTheMachine,
    'nightfall': parseNightfall,
    'heroicStrikes': parseHeroicStrikes,
    'weeklyCrucible': parseWeeklyCrucible,
    'kingsFall': parseKingsFall,
    'ironLordArtifacts': parseIronLordArtifacts,
    'shiro': parseShiro
};
let DEFAULTS = {
    'category': 'activities',
    'type': 'Featured Activity',
    'name': 'Unknown Activity',
    'image': '/images/advisors/backgrounds/default.jpg',
    'icon': '/images/advisors/icons/default.png'
};

export function getVendorDependencies() {
    let dependencies = [];
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        // does this advisor require any vendors?
        if (parser.vendors) {
            let activities = parser.activities;
            // is this advisor not linked to any activities?
            if (!activities || activities.length === 0) {
                parser.vendors.forEach(vendor => {
                    // ensure we don't load the same vendor twice
                    if (!dependencies.includes(vendor)) {
                        dependencies.push(vendor);
                    }
                }, this);
            }
        }
    }
    return dependencies;
}

export function getOptionalVendorDependencies(activities) {
    let dependencies = [];
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        // does this advisor have any optional vendors?
        if (parser.optionalVendors) {
            let addVendors = false;
            if (parser.activities && activities) {
                // only add vendors if all linked activities are active
                addVendors = true;
                for (let i = 0; i < parser.activities.length; i++) {
                    let activity = activities[parser.activities[i]];
                    if (!activity || !activity.status || !activity.status.active) {
                        addVendors = false;
                        break;
                    }
                }
            }
            else {
                // this advisor is not linked to any activities
                addVendors = true;
            }
            if (addVendors) {
                parser.optionalVendors.forEach(vendor => {
                    // ensure we don't load the same vendor twice
                    if (!dependencies.includes(vendor)) {
                        dependencies.push(vendor);
                    }
                }, this);
            }
        }
    }
    return dependencies;
}

export function parse(activities, vendors, manifest) {
    let advisors = {};
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        let advisor = parseAdvisor(
            parser, activities, vendors, manifest);
        if (advisor) {
            advisors[identifier] = advisor;
        }
    }
    return advisors;
}

function parseAdvisor(parser, activities, vendors, manifest) {
    if (!parser) return null;

    let expiresAt = null;

    // is this advisor linked to any activities?
    if (parser.activities) {
        if (!activities) return null;

        // don't show this advisor if any linked activities are inactive
        for (let i = 0; i < parser.activities.length; i++) {
            let activityID = parser.activities[i];

            // is the activity active?
            let activity = activities[activityID];
            if (!activity) return null;
            if (activity.status) {
                if (!activity.status.active) return null;

                // get activity expiration date
                if (activity.status.expirationKnown && !expiresAt) {
                    expiresAt = activity.status.expirationDate;
                }
            }
        }
    }

    // don't show this advisor if any linked vendors are not loaded
    if (parser.vendors && vendors) {
        for (let i = 0; i < parser.vendors.length; i++) {
            let vendorID = parser.vendors[i];
            let vendor = vendors[vendorID];
            if (!vendor || !vendor.stock) return null;

            // get vendor refresh date
            if (!expiresAt) {
                expiresAt = vendor.refreshesAt;
            }
        }
    }

    // run custom parser
    let advisor = parser.parser({
        activities: activities,
        vendors: vendors,
        manifest: manifest
    });
    if (!advisor) return null;

    // attach vendor stock
    if (vendors) {
        let vendorIDs = [];
        if (parser.vendors) {
            vendorIDs.push(...parser.vendors);
        }
        if (parser.optionalVendors) {
            vendorIDs.push(...parser.optionalVendors);
        }

        // load vendor stock
        let hasVendors = false;
        let advisorVendors = {};
        vendorIDs.forEach(vendorID => {
            let vendor = vendors[vendorID];
            if (vendor && vendor.stock) {
                hasVendors = true;
                advisorVendors[vendorID] = parseVendor(
                    vendors[vendorID], manifest);
            }
        }, this);
        if (hasVendors) {
            advisor.vendors = advisorVendors;
        }
    }

    // attach metadata
    advisor.expiresAt = expiresAt;

    // set any empty properties to default values
    for (let prop in DEFAULTS) {
        advisor[prop] = advisor[prop] || DEFAULTS[prop];
    }

    return advisor;
}

function parseVendor(vendor, manifest) {
    let stock = {};
    for (let categoryID in vendor.stock) {
        let category = vendor.stock[categoryID];
        if (category) {
            stock[categoryID] = parseItems(category, manifest);
        }
    }

    return {
        refreshesAt: vendor.refreshesAt,
        stock: stock
    };
}

function parseItems(category, manifest) {
    if (category) {
        let items = [];
        let hashes = [];

        category.forEach(item => {
            // don't show the same item more than once
            if (!hashes.includes(item.itemHash)) {
                hashes.push(item.itemHash);
                let definition = manifest.getItem(item.itemHash);
                if (definition) {
                    let output = {
                        name: definition.itemName,
                        icon: bnet(definition.icon),
                        type: definition.itemTypeName,
                        description: definition.itemDescription,
                        quantity: item.quantity
                    };
                    
                    // get costs
                    let costs = [];
                    item.costs.forEach(cost => {
                        let parsedCost = parseCost(cost, manifest);
                        if (parsedCost) {
                            costs.push(parsedCost);
                        }
                    }, this);
                    if (costs.length > 0) {
                        output.costs = costs;
                    }

                    items.push(output);
                }
            }
        }, this);
        return items;
    }
    return null;
}

function parseCost(cost, manifest) {
    // ignore if there is no cost
    if (cost.value === 0) {
        return null;
    }

    let definition = manifest.getItem(cost.itemHash);
    return {
        name: definition.itemName,
        icon: bnet(definition.icon),
        quantity: cost.value
    }
}

export function getFeaturedItems(id, vendors) {
    let parser = ADVISOR_PARSERS[id];
    if (parser) {
        let featured = parser.featuredItems;
        if (featured && featured.vendor && featured.category) {
            let vendor = vendors[featured.vendor];
            if (vendor && vendor.stock) {
                let category = vendor.stock[featured.category];
                return reduceItems(category);
            }
        }
    }
    return undefined;
}

function reduceItems(items) {
    if (!items) return undefined;
    return items.map(item => {
        return {
            name: item.name,
            icon: item.icon
        };
    });
}