import { bnet, parseModifiers, currency } from './utils';

export let parseDailyStory = createMissionParser({
    activity: 'dailychapter',
    category: 'daily',
    type: 'Daily Story Mission',
    image: "/images/advisors/backgrounds/default.jpg",
    icon: "/images/advisors/icons/dailyStory.png",
    rewards: {
        currencies: [currency('Legendary Marks', 15)]
    }
});
export let parseNightfall = createMissionParser({
    activity: 'nightfall',
    category: 'weekly',
    type: 'Nightfall Strike',
    image: "/images/advisors/backgrounds/nightfall.jpg",
    icon: "/images/advisors/icons/nightfall.png",
    rewards: {
        currencies: [
            currency('Skeleton Key', 1),
            currency('Unknown Rewards', 1)
        ]
    }
});
export let parseHeroicStrikes = createPlaylistParser({
    activity: 'heroicstrike',
    category: 'weekly',
    type: 'Heroic Strike Playlist',
    name: 'SIVA Crisis Heroic',
    image: "/images/advisors/backgrounds/heroicStrikes.jpg",
    icon: "/images/advisors/icons/heroicStrikes.png",
    rewards: {
        currencies: [
            currency('Treasures of the Dawning', 1),
            currency('Legendary Marks', 30, 10),
            currency('Legendary Engram', 1)
        ]
    }
});

function createMissionParser({activity, category, type, image, icon, rewards}) {
    return createParser(activity, {
        category: category,
        type: type,
        name: 'Unknown Mission',
        image: image,
        icon: icon,
        rewards: rewards
    });
}

function createPlaylistParser({activity, category, type, name, image, icon, rewards}) {
    return createParser(activity, {
        category: category,
        type: type,
        name: name,
        image: image,
        icon: icon,
        rewards: rewards
    });
}

function createParser(activity, defaults) {
    return {
        activities: [activity],
        parser: ({activities, manifest}) => {
            let output = defaults;
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

            return output;
        }
    };
}