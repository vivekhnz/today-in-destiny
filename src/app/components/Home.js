import React from 'react';

import Header from './Header';
import AdvisorGroup from './AdvisorGroup';

import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = AdvisorsStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        AdvisorsStore.listen(this.onChange);
    }

    componentWillUnmount() {
        AdvisorsStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    renderAdvisorGroups() {
        if (this.state.errorMessage) {
            return <div className="errorMessage">{this.state.errorMessage}</div>;
        }
        if (!this.state.advisorGroups) {
            return <div className="errorMessage">Loading...</div>;
        }
        if (this.state.advisorGroups.length > 0) {
            return (
                <div>
                    {
                        this.state.advisorGroups.map((group, i) =>
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
                <Header date={this.state.date} />
                {advisorGroups}
            </div>
        );
    };
}