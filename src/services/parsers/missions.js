import { bnet, parseModifiers, currency, copy } from './utils';
import { getStrikeLoot } from './rewards';

export let parseDailyStory = createMissionParser({
    activity: 'dailychapter',
    category: 'daily',
    shortID: 'story',
    type: 'Daily Story Mission',
    image: "/images/advisors/backgrounds/default.jpg",
    icon: "/images/advisors/icons/dailyStory.png",
    currencies: [currency('Legendary Marks', 15)]
});
export let parseNightfall = createMissionParser({
    activity: 'nightfall',
    category: 'weekly',
    shortID: 'nightfall',
    type: 'Nightfall Strike',
    image: "/images/advisors/backgrounds/nightfall.jpg",
    icon: "/images/advisors/icons/nightfall.png",
    currencies: [
        currency('Skeleton Key', 1),
        currency('Unknown Rewards', 1)
    ]
});
export let parseHeroicStrikes = createPlaylistParser({
    activity: 'heroicstrike',
    category: 'weekly',
    shortID: 'strikes',
    type: 'Heroic Strike Playlist',
    name: 'SIVA Crisis Heroic',
    image: "/images/advisors/backgrounds/heroicStrikes.jpg",
    icon: "/images/advisors/icons/heroicStrikes.png",
    currencies: [
        currency('Treasures of the Dawning', 1),
        currency('Legendary Marks', 30, 10),
        currency('Legendary Engram', 1)
    ],
    rewardSets: ['strikeHoardChests']
});

function createMissionParser(
    {activity, category, shortID, type, image, icon, currencies, rewardSets}) {
    return createParser(activity, currencies, shortID, {
        category: category,
        type: type,
        name: 'Unknown Mission',
        image: image,
        icon: icon,
        rewardSets: rewardSets
    });
}

function createPlaylistParser(
    {activity, category, shortID, type, name, image, icon, currencies, rewardSets}) {
    return createParser(activity, currencies, shortID, {
        category: category,
        type: type,
        name: name,
        image: image,
        icon: icon,
        rewardSets: rewardSets
    });
}

function createParser(activity, currencies, shortID, defaults) {
    return {
        shortID: shortID,
        activities: [activity],
        currencies: currencies,
        parser: ({activities, manifest}) => {
            let output = copy(defaults);

            let advisor = activities[activity];

            // obtain activity modifiers
            if (advisor.extended && advisor.extended.skullCategories) {
                let category = advisor.extended.skullCategories.find(
                    c => c.title === "Modifiers");
                output.modifiers = parseModifiers(category);
            }

            // obtain mission name and image
            if (advisor.display) {
                let activity = manifest.getActivity(advisor.display.activityHash);
                if (activity) {
                    output.name = activity.activityName;
                }
                output.image = bnet(advisor.display.image) || output.image;
            }

            // obtain strike-specific loot
            if (output.name) {
                let rewardSet = getStrikeLoot(output.name);
                if (rewardSet) {
                    if (!output.rewardSets) {
                        output.rewardSets = [];
                    }
                    output.rewardSets.push(rewardSet);
                }
            }

            return output;
        }
    };
}