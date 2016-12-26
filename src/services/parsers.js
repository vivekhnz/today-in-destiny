import time from './time';
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

function parse(activities, vendors, manifest) {
    let advisors = [];
    for (let identifier in ADVISOR_PARSERS) {
        let parser = ADVISOR_PARSERS[identifier];
        let advisor = parseAdvisor(
            identifier, parser, activities, vendors, manifest);
        if (advisor) {
            advisors.push(advisor);
        }
    }
    return advisors;
}

function parseAdvisor(id, parser, activities, vendors, manifest) {
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

    // attach metadata
    advisor.id = id;
    advisor.expiresAt = expiresAt;

    // set any empty properties to default values
    for (let prop in DEFAULTS) {
        advisor[prop] = advisor[prop] || DEFAULTS[prop];
    }

    return advisor;
}

export default parse;