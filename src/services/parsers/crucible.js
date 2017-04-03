import { currency } from './utils';

const CRUCIBLE_MODES = {
    '6v6': [
        'Classic 6v6', 'Freelance 6v6', 'Iron Banner Clash',
        'Inferno Clash', 'Clash', 'Control', 'Inferno Control',
        'Iron Banner Control', 'Zone Control'
    ],
    '3v3': [
        'Freelance 3v3', 'Classic 3v3', 'Skirmish', 'Inferno 3v3',
        'Inferno Skirmish', 'Elimination', 'Inferno Elimination'
    ],
    'doubles': ['Inferno Doubles', 'Doubles'],
    'mayhem': ['Mayhem Rumble', 'Mayhem Clash', 'Mayhem Supremacy'],
    'rift': ['Rift', 'Iron Banner Rift'],
    'combinedArms': ['Combined Arms'],
    'salvage': ['Salvage', 'Inferno Salvage'],
    'supremacy': [
        'Supremacy', 'Inferno Supremacy', 'Rumble Supremacy',
        'Iron Banner Supremacy'
    ]
};

export default createCrucibleParser({
    activity: 'weeklycrucible',
    category: 'weekly',
    type: 'Weekly Crucible Playlist',
    icon: "/images/advisors/icons/weeklyCrucible.png",
    currencies: [
        currency('Treasure of the Ages', 1),
        currency('Legendary Marks', 30, 10)
    ],
    rewardSets: ['cruciblePostGameRewards']
});

function createCrucibleParser(
    {activity, category, type, icon, currencies, rewardSets}) {
    return {
        shortID: 'crucible',
        activities: [activity],
        currencies: currencies,
        parser: ({activities, manifest}) => {
            let output = {
                category: category,
                name: 'Unknown Playlist',
                type: type,
                image: '/images/advisors/backgrounds/featuredCrucible.jpg',
                icon: icon,
                rewardSets: rewardSets
            };
            let advisor = activities[activity];

            // obtain playlist and image
            if (advisor.display) {
                let activity = manifest.getActivity(advisor.display.activityHash);
                if (activity) {
                    // hide the Weekly Crucible Playlist if Iron Banner is active
                    if (activity.activityName.startsWith("Iron Banner")) {
                        return null;
                    }
                    else {
                        output.name = activity.activityName;

                        // get playlist image
                        let playlistImage = getCrucibleModeImage(activity.activityName);
                        if (playlistImage) {
                            output.image = playlistImage;
                        }
                    }
                }
            }

            return output;
        }
    };
}

function getCrucibleModeImage(playlistName) {
    for (let id in CRUCIBLE_MODES) {
        let playlists = CRUCIBLE_MODES[id];
        if (playlists.includes(playlistName)) {
            return `/images/advisors/backgrounds/crucible-${id}.jpg`;
        }
    }
}