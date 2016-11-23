import React from 'react';
import Header from './Header';
import AdvisorGroup from './AdvisorGroup';
import Advisor from './Advisor';
import HomeStore from '../stores/HomeStore';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
    }

    render() {
        return (
            <div>
                <Header date={this.state.date} />
                {
                    this.state.advisorGroups
                        ? this.state.advisorGroups.map((group, i) =>
                            <AdvisorGroup key={i}
                                name={group.name}
                                advisors={group.advisors} />)
                        : null
                }
            </div>
        );
    };
}

export default Home;