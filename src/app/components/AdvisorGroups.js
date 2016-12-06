import React from 'react';
import AdvisorGroup from './AdvisorGroup';

class AdvisorGroups extends React.Component {
    componentDidMount() {
        this.props.fetchAdvisors();
    }

    render() {
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
    };
};

export default AdvisorGroups;