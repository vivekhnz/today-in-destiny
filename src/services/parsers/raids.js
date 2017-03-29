import { parseModifiers } from './utils';

const RAID_IDENTIFIERS = {
    "Vault of Glass": 'vog',
    "Crota's End": 'crota',
    "King's Fall": 'kf',
    "Wrath of the Machine": 'wotm'
};

export const parseFeaturedRaid = {
    shortID: 'raid',
    activities: ['weeklyfeaturedraid'],
    parser: ({ activities, manifest }) => {
        const output = {
            category: 'weekly',
            type: 'Weekly Featured Raid',
            name: 'Unknown Raid',
            image: '/images/advisors/backgrounds/raid.jpg',
            icon: '/images/advisors/icons/raid.png',
            rewardSets: []
        };

        // obtain featured raid
        const advisor = activities.weeklyfeaturedraid;
        if (advisor.display) {
            const activity = manifest.getActivity(
                advisor.display.activityHash);
            if (activity) {
                output.name = activity.activityName;

                // obtain raid identifier
                const identifier = RAID_IDENTIFIERS[output.name];
                if (identifier) {
                    output.image = `/images/advisors/backgrounds/raid-${identifier}.jpg`;
                    output.icon = `/images/advisors/icons/raid-${identifier}.png`;

                    output.rewardSets = [
                        `raid-${identifier}-challenges`,
                        `raid-${identifier}-weapons`,
                        `raid-${identifier}-armor`,
                        `raid-${identifier}-equipment`
                    ];
                }
            }
        }

        // obtain challenge modes
        if (advisor.activityTiers) {
            output.modifiers = parseChallengeModes(
                advisor.activityTiers);
        }

        return output;
    }
};

function parseChallengeModes(tiers) {
    if (tiers.length > 0 && tiers[0].skullCategories) {
        const category = tiers[0].skullCategories.find(
            c => c.title === "Modifiers");
        const modifiers = parseModifiers(category);

        if (modifiers) {
            // don't show the Heroic modifier
            let output = [];
            modifiers.forEach(modifier => {
                if (modifier.name != 'Heroic') {
                    output.push(modifier);
                }
            }, this);
            return output;
        }
    }
    return null;
}