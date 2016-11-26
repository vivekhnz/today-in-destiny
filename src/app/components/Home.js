import React from 'react';
import AltContainer from 'alt-container';

import Header from './Header';
import AdvisorGroups from './AdvisorGroups';

import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';

class Home extends React.Component {
    render() {
        return (
            <div>
                <Header month="Nov" day="18" />
                <AltContainer
                    store={AdvisorsStore}
                    actions={AdvisorsActions}
                    component={AdvisorGroups} />
            </div>
        );
    };
}

export default Home;