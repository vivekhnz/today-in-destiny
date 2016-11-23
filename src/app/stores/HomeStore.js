import alt from '../alt';

class HomeStore {
    constructor() {
        const events = [
            {
                type: "Agent of the Nine",
                name: "Xûr has arrived...",
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
                timeRemaining: "2d 22h 23m"
            }
        ];
        const today = [
            {
                type: "Daily Story Mission",
                name: "Enemy of My Enemy",
                timeRemaining: "22h 23m"
            },
            {
                type: "Daily Crucible Playlist",
                name: "Control",
                timeRemaining: "22h 23m"
            }
        ];
        const thisWeek = [
            {
                type: "Raid",
                name: "Wrath of the Machine",
                timeRemaining: "2d 22h 23m",
                modifiers: ["Vosik Challenge"]
            },
            {
                type: "Nightfall Strike",
                name: "The Wretched Eye",
                timeRemaining: "2d 22h 23m",
                modifiers: ["Epic", "Arc Burn", "Brawler", "Ironclad", "Exposure"]
            },
            {
                type: "Heroic Strike Playlist",
                name: "SIVA Crisis Heroic",
                timeRemaining: "2d 22h 23m",
                modifiers: ["Heroic", "Specialist", "Exposure", "Airborne"]
            },
            {
                type: "Weekly Crucible Playlist",
                name: "Inferno Supremacy",
                timeRemaining: "2d 22h 23m"
            },
            {
                type: "Raid",
                name: "King's Fall",
                timeRemaining: "2d 22h 23m",
                modifiers: ["Warpriest Challenge"]
            }
        ];

        this.advisorGroups = [
            { name: "Events", advisors: events },
            { name: "Today", advisors: today },
            { name: "This Week", advisors: thisWeek }
        ];
        this.date = {
            month: "Nov",
            day: 18
        }
    };
}

export default alt.createStore(HomeStore);