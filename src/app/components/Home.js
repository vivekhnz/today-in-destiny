import React from 'react';
import AltContainer from 'alt-container';

import Header from './Header';
import AdvisorGroups from './AdvisorGroups';
import Footer from './Footer';

import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';

class Home extends React.Component {
    render() {
        return (
            <div>
                <AltContainer
                    store={AdvisorsStore}
                    actions={AdvisorsActions}>
                    <Header />
                    <AdvisorGroups />
                    <Footer />
                </AltContainer>
            </div>
        );
    };
}

export default Home;