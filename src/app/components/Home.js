import React from 'react';
import Advisor from './Advisor'

class Home extends React.Component {
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
                <div>
                    <p>Events</p>
                    <ul>
                        <li>
                            <Advisor type="Agent of the Nine"
                                     name="Xûr has arrived..."
                                     timeRemaining="22h 23m"
                                     items={[
                                         "Hard Light",
                                         "An Insurmountable Skullfort",
                                         "Young Ahamkara's Spine",
                                         "Apotheosis Veil",
                                         "Three of Coins"]} />
                        </li>
                        <li>
                            <Advisor type="Trials of Osiris"
                                     name="The Burning Shrine"
                                     timeRemaining="2d 22h 23m" />
                        </li>
                    </ul>
                </div>
                <div>
                    <p>Today</p>
                    <ul>
                        <li>
                            <Advisor type="Daily Story Mission"
                                     name="Enemy of My Enemy"
                                     timeRemaining="22h 23m" />
                        </li>
                        <li>
                            <Advisor type="Daily Crucible Playlist"
                                     name="Control"
                                     timeRemaining="22h 23m" />
                        </li>
                    </ul>
                </div>
                <div>
                    <p>This Week</p>
                    <ul>
                        <li>
                            <Advisor type="Raid"
                                     name="Wrath of the Machine"
                                     timeRemaining="2d 22h 23m"
                                     modifiers={["Vosik Challenge"]} />
                        </li>
                        <li>
                            <Advisor type="Nightfall Strike"
                                     name="The Wretched Eye"
                                     timeRemaining="2d 22h 23m"
                                     modifiers={[
                                         "Epic",
                                         "Arc Burn",
                                         "Brawler",
                                         "Ironclad",
                                         "Exposure"]} />
                        </li>
                        <li>
                            <Advisor type="Heroic Strike Playlist"
                                     name="SIVA Crisis Heroic"
                                     timeRemaining="2d 22h 23m"
                                     modifiers={[
                                         "Heroic",
                                         "Specialist",
                                         "Exposure",
                                         "Airborne"]} />
                        </li>
                        <li>
                            <Advisor type="Weekly Crucible Playlist"
                                     name="Inferno Supremacy"
                                     timeRemaining="2d 22h 23m" />
                        </li>
                        <li>
                            <Advisor type="Raid"
                                     name="King's Fall"
                                     timeRemaining="2d 22h 23m"
                                     modifiers={["Warpriest Challenge"]} />
                        </li>
                    </ul>
                </div>
            </div>
        );
    };
}

export default Home;