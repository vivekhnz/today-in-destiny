import { currency } from './utils';

let CRUCIBLE_MODES = {
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

let POST_GAME_REWARDS = [
    'Hex Caster ARC',
    'Red Spectre',
    'Eyasluna',
    'Ill Will',
    'Hopscotch Pilgrim',
    'Cryptic Dragon',
    'NL Shadow 701X',
    'Matador 64',
    'Party Crasher +1',
    '20/20 AMR7',
    '77 Wizard',
    'Steel Oracle Z-11',
    'The Ash Factory',
    'Unending Deluge III'
];

export let parseDailyCrucible = createCrucibleParser({
    activity: 'dailycrucible',
    category: 'daily',
    type: 'Daily Crucible Playlist',
    icon: "/images/advisors/icons/dailyCrucible.png",
    rewards: {
        currencies: [currency('Legendary Marks', 15)],
        rewardSets: {
            'Post-Game Rewards': POST_GAME_REWARDS
        }
    }
});
export let parseWeeklyCrucible = createCrucibleParser({
    activity: 'weeklycrucible',
    category: 'weekly',
    type: 'Weekly Crucible Playlist',
    icon: "/images/advisors/icons/weeklyCrucible.png",
    rewards: {
        currencies: [
            currency('Radiant Treasure', 1),
            currency('Legendary Marks', 30, 10)
        ],
        rewardSets: {
            'Post-Game Rewards': POST_GAME_REWARDS
        }
    }
});

function createCrucibleParser({activity, category, type, icon, rewards}) {
    return {
        activities: [activity],
        parser: ({activities, manifest}) => {
            let output = {
                category: category,
                name: 'Unknown Playlist',
                type: type,
                image: '/images/advisors/backgrounds/featuredCrucible.jpg',
                icon: icon,
                rewards: rewards
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