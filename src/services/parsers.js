import time from './time';
import { bnet } from './parsers/utils';
import { REWARDS, CURRENCIES } from './parsers/rewards';
import { default as parseXur } from './parsers/xur';
import { default as parseTrials } from './parsers/trials';
import { default as parseIronBanner } from './parsers/ironBanner';
import { parseWeeklyStory, parseNightfall, parseHeroicStrikes } from './parsers/missions';
import { default as parseWeeklyCrucible } from './parsers/crucible';
import { default as parseFeaturedRaid } from './parsers/raids';
import { parseIronLordArtifacts, parseShiro } from './parsers/vendors';

const ADVISOR_PARSERS = {
    'xur': parseXur,
    'trials': parseTrials,
    'ironBanner': parseIronBanner,
    'raid': parseFeaturedRaid,
    'nightfall': parseNightfall,
    'heroicStrikes': parseHeroicStrikes,
    'weeklyStory': parseWeeklyStory,
    'weeklyCrucible': parseWeeklyCrucible,
    'ironLordArtifacts': parseIronLordArtifacts,
    'shiro': parseShiro
};
const DEFAULTS = {
    'category': 'activities',
    'type': 'Featured Activity',
    'name': 'Unknown Activity',
    'image': '/images/advisors/backgrounds/default.jpg',
    'icon': '/images/advisors/icons/default.png'
};
const STAT_ALIASES = {
    'Intellect': 'INT',
    'Discipline': 'DIS',
    'Strength': 'STR'
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

export function getCurrencies() {
    let currencies = [];
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        // does this activity reward any currencies?
        if (parser.currencies) {
            parser.currencies.forEach(currency => {
                if (currency.name) {
                    // ensure we don't add the same currency twice
                    if (!currencies.includes(currency.name)) {
                        currencies.push(currency.name);
                    }
                }
            }, this);
        }
    }
    return currencies;
}

export function parse(activities, vendors, manifest, items) {
    let output = {
        advisors: {},
        categories: {}
    };
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        let advisor = parseAdvisor(
            parser, activities, vendors, manifest, items);
        if (advisor) {
            output.advisors[identifier] = advisor;

            // build category advisor alias map
            if (advisor.category && parser.shortID) {
                let category = output.categories[advisor.category];
                if (category) {
                    category[parser.shortID] = identifier;
                }
                else {
                    category = {};
                    category[parser.shortID] = identifier;
                    output.categories[advisor.category] = category;
                }
            }
        }
    }
    return output;
}

function parseAdvisor(parser, activities, vendors, manifest, items) {
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

    // parse rewards
    if (parser.currencies || advisor.rewardSets) {
        advisor.rewards = parseRewards(
            parser.currencies, advisor.rewardSets, items);

        // clear identifiers
        advisor.rewardSets = undefined;
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
        name: vendor.name,
        refreshesAt: vendor.refreshesAt,
        stock: stock
    };
}

function parseItems(category, manifest) {
    if (category) {
        let items = [];
        category.forEach(item => {
            let definition = manifest.getItem(item.itemHash);
            if (definition) {
                let output = {
                    hash: item.itemHash,
                    name: definition.itemName,
                    icon: bnet(definition.icon),
                    type: definition.itemTypeName,
                    description: definition.itemDescription,
                    tier: definition.tierTypeName,
                    quantity: item.quantity,
                    stats: parseStats(
                        item.primaryStat, item.stats, manifest),
                    perks: parsePerks(item.perks, manifest)
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

function parseStats(primary, secondary, manifest) {
    let stats = [];
    if (secondary) {
        secondary.forEach(stat => {
            let parsed = parseStat(
                stat, manifest, true);
            if (parsed) {
                stats.push(parsed);
            }
        }, this);
    }
    if (stats.length === 0) {
        stats = undefined;
    }
    if (!primary && !stats) {
        return undefined;
    }

    return {
        primary: parseStat(primary, manifest, false),
        secondary: stats
    };
}

function parseStat(stat, manifest, useAlias) {
    if (stat && stat.value > 0) {
        let definition = manifest.getStat(stat.statHash);
        if (definition) {
            if (useAlias) {
                let alias = STAT_ALIASES[definition.statName];
                if (alias) {
                    return {
                        name: alias,
                        value: stat.value
                    };
                }
            }
            else {
                return {
                    name: definition.statName,
                    value: stat.value
                };
            }
        }
    }
    return undefined;
}

function parsePerks(perks, manifest) {
    if (!perks || perks.length === 0) {
        return undefined;
    }
    let output = [];
    perks.forEach(perk => {
        let definition = manifest.getPerk(perk.perkHash);
        if (definition) {
            output.push({
                icon: bnet(definition.displayIcon),
                description: definition.displayDescription
            });
        }
    }, this);
    return output;
}

function parseRewards(currencies, rewardSets, items) {
    let output = {};

    // attach currency icons
    if (currencies) {
        output.currencies = [];
        currencies.forEach(currency => {
            let icon = CURRENCIES[currency.name];
            if (!icon) {
                icon = 'unknown.jpg';
            }
            currency.icon = `/images/currencies/${icon}`;
            output.currencies.push(currency);
        }, this);
    }

    // parse reward sets
    if (rewardSets) {
        output.rewardSets = [];
        rewardSets.forEach(set => {
            let definition = REWARDS[set];
            if (definition && definition.name && definition.items) {
                // lookup item definitions
                let itemDefinitions = [];
                definition.items.forEach(hash => {
                    let itemDef = items[hash] || {
                        hash: hash,
                        name: 'Unknown Item',
                        type: 'Unknown Item',
                        icon: '/images/ui/unknownItem.png',
                        tier: 'Common'
                    };
                    itemDefinitions.push(itemDef);
                }, this);

                // add reward set
                output.rewardSets.push({
                    name: definition.name,
                    items: itemDefinitions
                });
            }
        }, this);
    }

    return output;
}

export function getFeaturedItemSummaries(id, vendors) {
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
    let hashes = [];
    let output = [];
    items.forEach(item => {
        if (!hashes.includes(item.hash)) {
            hashes.push(item.hash);
            output.push({
                name: item.name,
                icon: item.icon
            });
        }
    }, this);
    return output;
}

export function getStock(id, vendors) {
    let parser = ADVISOR_PARSERS[id];
    if (parser) {
        return {
            featured: getFeaturedItems(
                parser.featuredItems, vendors),
            other: getOtherItems(
                parser.featuredItems, vendors)
        };
    }
    return undefined;
}

function getFeaturedItems(featured, vendors) {
    if (featured && featured.vendor && featured.category) {
        let vendor = vendors[featured.vendor];
        if (vendor && vendor.stock) {
            let category = vendor.stock[featured.category];
            return {
                name: featured.category,
                items: category
            };
        }
    }
    return undefined;
}

function getOtherItems(featured, vendors) {
    let output = [];
    for (let vendorID in vendors) {
        let vendor = vendors[vendorID];
        let categories = [];
        for (let categoryName in vendor.stock) {
            if (vendorID !== featured.vendor
                || categoryName != featured.category) {
                categories.push({
                    name: categoryName,
                    items: vendor.stock[categoryName]
                });
            }
        }
        if (categories.length > 0) {
            output.push({
                name: vendor.name,
                categories: categories
            });
        }
    }
    if (output.length > 0) {
        return output;
    }
    else {
        return undefined;
    }
}