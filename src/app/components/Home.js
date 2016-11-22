import React from 'react';
import AdvisorGroup from './AdvisorGroup';
import Advisor from './Advisor';

class Home extends React.Component {
    constructor(props) {
        super(props);

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

        this.state = { events, today, thisWeek };
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <p>Today in</p>
                        <p>Destiny</p>
                    </div>
                    <div>
                        <p>Nov</p>
                        <p>18</p>
                    </div>
                </div>
                <AdvisorGroup name="Events" advisors={this.state.events} />
                <AdvisorGroup name="Today" advisors={this.state.today} />
                <AdvisorGroup name="This Week" advisors={this.state.thisWeek} />
            </div>
        );
    };
}

export default Home;