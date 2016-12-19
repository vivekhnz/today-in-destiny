import React from 'react';
import AltContainer from 'alt-container';

import SmallHeader from './SmallHeader';
import AdvisorsStore from '../stores/AdvisorsStore';
import AdvisorsActions from '../actions/AdvisorsActions';

class Activity extends React.Component {
    render() {
        return (
            <div>
                <AltContainer
                    store={AdvisorsStore}
                    actions={AdvisorsActions}>
                    <SmallHeader />
                </AltContainer>
                <div className="groupHeader">{this.props.params.id}</div>
            </div>
        );
    };
}

export default Activity;