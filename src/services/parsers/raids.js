import { parseModifiers } from './utils';

const RAID_IDENTIFIERS = {
    "Vault of Glass": 'vog',
    "Crota's End": 'crota',
    "King's Fall": 'kf',
    "Wrath of the Machine": 'wotm'
};

let RAID_CHALLENGE_MODES = {
    'Warpriest Challenge': 'warpriest',
    'Golgoroth Challenge': 'golgoroth',
    'Oryx Challenge': 'oryx',
    'Vosik Challenge': 'vosik',
    'Aksis Challenge': 'aksis',
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
                }
            }
        }

        return output;
    }
};

export let parseWrathOfTheMachine = createRaidParser({
    activity: 'wrathofthemachine',
    identifier: 'wotm',
    name: 'Wrath of the Machine',
    rewardSets: [
        'wotmNormalMode', 'wotmHeroicMode',
        'wotmSecrets'
    ]
});
export let parseKingsFall = createRaidParser({
    activity: 'kingsfall',
    identifier: 'kf',
    name: "King's Fall",
    rewardSets: [
        'kfNormalMode', 'kfHeroicMode',
        'kfSecrets'
    ]
});

function createRaidParser({ activity, identifier, name, rewardSets }) {
    return {
        shortID: identifier,
        activities: [activity],
        parser: ({ activities, manifest }) => {
            let output = {
                category: 'weekly',
                name: name,
                type: 'Raid',
                image: `/images/advisors/backgrounds/raid-${identifier}.jpg`,
                icon: `/images/advisors/icons/raid-${identifier}.png`,
                rewardSets: [...rewardSets]
            };
            let advisor = activities[activity];

            // obtain challenge modes
            if (advisor.activityTiers) {
                let modifiers = parseChallengeModes(advisor.activityTiers);
                if (modifiers) {
                    // is there a single challenge mode active?
                    if (modifiers.length === 1) {
                        let activeChallenge = modifiers[0].name;
                        output.name = activeChallenge;
                        output.type = name;

                        let bossID = RAID_CHALLENGE_MODES[activeChallenge];
                        if (bossID) {
                            // set challenge mode background
                            output.image = `/images/advisors/backgrounds/raid-${identifier}-${bossID}.jpg`;

                            // add challenge mode rewards
                            let challengeRewards = `${identifier}Challenge-${bossID}`;
                            output.rewardSets.splice(0, 0, challengeRewards);
                        }
                    }
                    else {
                        output.modifiers = modifiers;
                    }
                }
            }

            return output;
        }
    };
}

function parseChallengeModes(tiers) {
    // use Normal mode so we don't get the Heroic modifier
    let normalTier = tiers.find(
        t => t.tierDisplayName === "Normal");
    if (normalTier && normalTier.skullCategories) {
        let category = normalTier.skullCategories.find(
            c => c.title === "Modifiers");
        return parseModifiers(category);
    }
    return null;
}