import React from 'react';
import AltContainer from 'alt-container';
import wrap from './AltWrapper';

import Header from './Header';
import AdvisorGroup from './AdvisorGroup';

import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';

class Home extends React.Component {
    renderAdvisorGroups() {
        if (this.props.errorMessage) {
            return <div className="errorMessage">{this.props.errorMessage}</div>;
        }
        if (!this.props.advisorGroups) {
            return <div className="errorMessage">Loading...</div>;
        }
        if (this.props.advisorGroups.length > 0) {
            return (
                <div>
                    {
                        this.props.advisorGroups.map((group, i) =>
                            <AdvisorGroup key={i}
                                name={group.name}
                                advisors={group.advisors} />)
                    }
                </div>
            );
        }
        else {
            return <div className="errorMessage">We couldn't find any current activities.</div>;
        }
    }

    render() {
        let advisorGroups = this.renderAdvisorGroups();
        return (
            <div>
                <Header date={this.props.date} />
                {advisorGroups}
            </div>
        );
    };
}

export default wrap(Home, AdvisorsStore, AdvisorsActions);