import { bnet, parseModifiers } from './utils';

export let parseDailyStory = createMissionParser({
    activity: 'dailychapter',
    category: 'daily',
    type: 'Daily Story Mission',
    image: "/images/advisors/backgrounds/default.jpg",
    icon: "/images/advisors/icons/dailyStory.png"
});
export let parseNightfall = createMissionParser({
    activity: 'nightfall',
    category: 'weekly',
    type: 'Nightfall Strike',
    image: "/images/advisors/backgrounds/nightfall.jpg",
    icon: "/images/advisors/icons/nightfall.png"
});
export let parseHeroicStrikes = createPlaylistParser({
    activity: 'heroicstrike',
    category: 'weekly',
    type: 'Heroic Strike Playlist',
    name: 'SIVA Crisis Heroic',
    image: "/images/advisors/backgrounds/heroicStrikes.jpg",
    icon: "/images/advisors/icons/heroicStrikes.png"
});

function createMissionParser({activity, category, type, image, icon}) {
    return createParser(activity, {
        category: category,
        type: type,
        name: 'Unknown Mission',
        image: image,
        icon: icon
    });
}

function createPlaylistParser({activity, category, type, name, image, icon}) {
    return createParser(activity, {
        category: category,
        type: type,
        name: name,
        image: image,
        icon: icon
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