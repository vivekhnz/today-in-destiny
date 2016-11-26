import React from 'react';
import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';
import AdvisorGroup from './AdvisorGroup';

class AdvisorGroups extends React.Component {
    constructor(props) {
        super(props);

        this.state = AdvisorsStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        AdvisorsStore.listen(this.onChange);
        AdvisorsActions.fetchAdvisors();
    }

    componentWillUnmount() {
        AdvisorsStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        if (this.state.errorMessage) {
            return <div>{this.state.errorMessage}</div>;
        }
        if (!this.state.advisorGroups.length) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                {
                    this.state.advisorGroups.map((group, i) =>
                        <AdvisorGroup key={i}
                            name={group.name}
                            advisors={group.advisors} />)
                }
            </div>);
    };
};

export default AdvisorGroups;