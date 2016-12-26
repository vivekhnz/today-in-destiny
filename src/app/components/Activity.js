import React from 'react';

import SmallHeader from './SmallHeader';

import ActivityStore from '../stores/ActivityStore';
import ActivityActions from '../actions/ActivityActions';

var overlayColor = 'rgba(39, 58, 65, 0.75)';

export default class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        ActivityStore.listen(this.onChange);
        ActivityActions.fetchAdvisor(this.props.params.id);
    }

    componentWillUnmount() {
        ActivityStore.unlisten(this.onChange);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.id !== this.props.params.id) {
            ActivityActions.fetchAdvisor(this.props.params.id);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    renderIcon() {
        if (this.state.activity && this.state.activity.icon) {
            let iconStyle = {
                backgroundImage: `url('${this.state.activity.icon}')`
            };
            return (
                <div className="activityIcon" style={iconStyle}></div>
            );
        }
        return null;
    }

    renderHeroImage() {
        let activity = this.state.activity || {
            name: null,
            type: null,
            image: null
        };

        let heroImageStyle = {
            background: activity.image
                ? `linear-gradient(${overlayColor}, ${overlayColor}), url('${activity.image}')`
                : overlayColor
        };
        let icon = this.renderIcon();
        return (
            <div className="activityHeroImage" style={heroImageStyle}>
                <SmallHeader date={this.state.date} />
                <div className="activityHeroWrapper">
                    <div className="activityHeroContainer">
                        {icon}
                        <div className="activityHeroContent">
                            <p className="activityType">{activity.type}</p>
                            <p className="activityName">{activity.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let hero = this.renderHeroImage();
        return (
            <div>
                {hero}
                <div className="errorMessage">{this.props.params.id}</div>
            </div>
        );
    };
}