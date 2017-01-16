import { parseModifiers } from './utils';

let RAID_CHALLENGE_MODES = {
    'Warpriest Challenge': 'warpriest',
    'Golgoroth Challenge': 'golgoroth',
    'Oryx Challenge': 'oryx',
    'Vosik Challenge': 'vosik',
    'Aksis Challenge': 'aksis',
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

function createRaidParser({activity, identifier, name, rewardSets}) {
    return {
        activities: [activity],
        parser: ({activities, manifest}) => {
            let output = {
                category: 'weekly',
                name: name,
                type: 'Raid',
                image: `/images/advisors/backgrounds/raid-${identifier}.jpg`,
                icon: `/images/advisors/icons/raid-${identifier}.png`,
                rewardSets: rewardSets
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
                            if (rewardSets) {
                                output.rewardSets = [
                                    challengeRewards,
                                    ...rewardSets
                                ];
                            }
                            else {
                                output.rewardSets = [challengeRewards];
                            }
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