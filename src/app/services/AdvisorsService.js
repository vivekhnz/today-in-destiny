const events = [
    {
        type: "Agent of the Nine",
        name: "Xûr has arrived...",
        icon: "https://www.bungie.net/img/destiny_content/events/xur_icon.png",
        image: "https://www.bungie.net/img/theme/bungienet/bgs/bg_xuravailable.jpg",
        timeRemaining: "22h 23m",
        items: [
            "Hard Light",
            "An Insurmountable Skullfort",
            "Young Ahamkara's Spine",
            "Apotheosis Veil",
            "Three of Coins"
        ]
    },
    {
        type: "Trials of Osiris",
        name: "The Burning Shrine",
        icon: "https://www.bungie.net/img/theme/destiny/icons/osiris_diamond.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/crucible_the_burning_shrine.jpg",
        timeRemaining: "2d 22h 23m"
    }
];
const today = [
    {
        type: "Daily Story Mission",
        name: "Enemy of My Enemy",
        icon: "https://www.bungie.net/img/theme/destiny/icons/node_story_featured.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/enemy_of_my_enemy.jpg",
        timeRemaining: "22h 23m"
    },
    {
        type: "Daily Crucible Playlist",
        name: "Control",
        icon: "https://www.bungie.net/img/destiny_content/advisors/pvp_Control.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/daily_crucible.jpg",
        timeRemaining: "22h 23m"
    }
];
const thisWeek = [
    {
        type: "Raid",
        name: "Wrath of the Machine",
        icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wrath_of_the_machine.jpg",
        timeRemaining: "2d 22h 23m",
        modifiers: ["Vosik Challenge"]
    },
    {
        type: "Nightfall Strike",
        name: "The Wretched Eye",
        icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_nightfall.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/wretched_eye.jpg",
        timeRemaining: "2d 22h 23m",
        modifiers: ["Epic", "Arc Burn", "Brawler", "Ironclad", "Exposure"]
    },
    {
        type: "Heroic Strike Playlist",
        name: "SIVA Crisis Heroic",
        icon: "https://www.bungie.net/img/theme/destiny/icons/node_strike_featured.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_heroic.jpg",
        timeRemaining: "2d 22h 23m",
        modifiers: ["Heroic", "Specialist", "Exposure", "Airborne"]
    },
    {
        type: "Weekly Crucible Playlist",
        name: "Inferno Supremacy",
        icon: "https://www.bungie.net/common/destiny_content/icons/203b106719909523844384cb4e2cae1f.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/weekly_crucible.jpg",
        timeRemaining: "2d 22h 23m"
    },
    {
        type: "Raid",
        name: "King's Fall",
        icon: "https://www.bungie.net/common/destiny_content/icons/08142310168ad6ade9a6e4252e8433fc.png",
        image: "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/kings_fall.jpg",
        timeRemaining: "2d 22h 23m",
        modifiers: ["Warpriest Challenge"]
    }
];
const mockData = {
    date: { month: "Nov", day: 18 },
    advisorGroups: [
        { name: "Events", advisors: events },
        { name: "Today", advisors: today },
        { name: "This Week", advisors: thisWeek }
    ]
};

class AdvisorsService {
    fetchAdvisors() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(mockData), 750);
        });
    }
}

export default new AdvisorsService();