import React from 'react';
import AltContainer from 'alt-container';
import wrap from './AltWrapper';

import SmallHeader from './SmallHeader';

import ActivityStore from '../stores/ActivityStore';
import ActivityActions from '../actions/ActivityActions';

class Activity extends React.Component {
    render() {
        return (
            <div>
                <div className="activityHeroImage">
                    <SmallHeader date={this.props.date} />
                    <div className="activityHeroContent">
                        <div className="advisorContainer">
                            <p className="advisorName">{this.props.params.id}</p>
                        </div>
                    </div>
                </div>
                <div className="errorMessage">{this.props.params.id}</div>
            </div>
        );
    };
}

export default wrap(Activity, ActivityStore, ActivityActions);