import React from 'react';
import AdvisorGroup from './AdvisorGroup';

class AdvisorGroups extends React.Component {
    componentDidMount() {
        this.props.fetchAdvisors();
    }

    render() {
        if (this.props.errorMessage) {
            return <div>{this.props.errorMessage}</div>;
        }
        if (!this.props.advisorGroups
            || !this.props.advisorGroups.length) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                {
                    this.props.advisorGroups.map((group, i) =>
                        <AdvisorGroup key={i}
                            name={group.name}
                            advisors={group.advisors} />)
                }
            </div>);
    };
};

export default AdvisorGroups;