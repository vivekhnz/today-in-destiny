import React from 'react';
import AltContainer from 'alt-container';
import wrap from './AltWrapper';

import SmallHeader from './SmallHeader';

import ActivityStore from '../stores/ActivityStore';
import ActivityActions from '../actions/ActivityActions';

var overlayColor = 'rgba(39, 58, 65, 0.75)';

class Activity extends React.Component {
    render() {
        let heroImage = '/images/advisors/backgrounds/default.jpg';
        let heroImageStyle = {
            background: heroImage
                ? `linear-gradient(${overlayColor}, ${overlayColor}), url('${heroImage}')`
                : overlayColor
        };
        let iconStyle = {
            backgroundImage: "url('/images/advisors/icons/default.png')"
        };
        return (
            <div>
                <div className="activityHeroImage" style={heroImageStyle}>
                    <SmallHeader date={this.props.date} />
                    <div className="activityHeroWrapper">
                        <div className="activityHeroContainer">
                            <div className="activityIcon" style={iconStyle}></div>
                            <div className="activityHeroContent">
                                <p className="activityType">{this.props.params.id}</p>
                                <p className="activityName">{this.props.params.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="errorMessage">{this.props.params.id}</div>
            </div>
        );
    };
}

export default wrap(Activity, ActivityStore, ActivityActions);