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

    getAdvisorsSummaries(identifiers) {
        let summaries = [];
        if (identifiers) {
            identifiers.forEach(id => {
                let summary = this.state.summaries[id];
                if (summary) {
                    summaries.push(summary);
                }
            }, this);
        }
        return summaries;
    }

    renderAdvisorGroups() {
        if (this.state.errorMessage) {
            return <div className="errorMessage">{this.state.errorMessage}</div>;
        }
        if (!this.state.categories || !this.state.summaries) {
            return <div className="errorMessage">Loading...</div>;
        }
        if (this.state.categories.length > 0) {
            return (
                <div>
                    {
                        this.state.categories.map((group, i) => {
                            let advisors = this.getAdvisorsSummaries(group.advisors);
                            return <AdvisorGroup key={i}
                                name={group.name}
                                advisors={advisors} />;
                        })
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
                <Header />
                {advisorGroups}
            </div>
        );
    };
}