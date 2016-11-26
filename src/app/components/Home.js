import React from 'react';
import Header from './Header';
import AdvisorGroups from './AdvisorGroups';

class Home extends React.Component {
    render() {
        return (
            <div>
                <Header month="Nov" day="18" /> 
                <AdvisorGroups />
            </div>
        );
    };
}

export default Home;