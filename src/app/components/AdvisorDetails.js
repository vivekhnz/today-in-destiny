import React from 'react';

import SmallHeader from './SmallHeader';
import ActivityRewards from './ActivityRewards';
import ActivityModifiers from './ActivityModifiers';

import AdvisorsStore from '../stores/AdvisorsStore';
import DetailsStore from '../stores/DetailsStore';
import DetailsActions from '../actions/DetailsActions';

var overlayColor = 'rgba(39, 58, 65, 0.75)';

export default class AdvisorDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onAdvisorsChanged = this.onAdvisorsChanged.bind(this);
        this.onDetailsChanged = this.onDetailsChanged.bind(this);
    }

    update() {
        this.onAdvisorsChanged(AdvisorsStore.getState());
        this.onDetailsChanged(DetailsStore.getState());
        if (!this.state.details) {
            DetailsActions.fetchAdvisor(this.props.params.id);
        }
    }

    componentDidMount() {
        AdvisorsStore.listen(this.onAdvisorsChanged);
        DetailsStore.listen(this.onDetailsChanged);
        this.update();
    }

    componentWillUnmount() {
        AdvisorsStore.unlisten(this.onAdvisorsChanged);
        DetailsStore.unlisten(this.onDetailsChanged);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.id !== this.props.params.id) {
            this.update();
        }
    }

    onAdvisorsChanged(advisors) {
        if (advisors && advisors.summaries) {
            let summary = advisors.summaries[this.props.params.id];
            if (summary) {
                this.setState({
                    summary: summary
                });
            }
        }
    }

    onDetailsChanged(store) {
        if (store) {
            if (store.errorMessage) {
                this.setState({
                    errorMessage: store.errorMessage
                });
            }
            else if (store.details) {
                let details = store.details[this.props.params.id];
                if (details) {
                    this.setState({
                        details: details
                    });
                }
            }
        }
    }

    renderIcon(summary) {
        if (summary.icon) {
            let iconStyle = {
                backgroundImage: `url('${summary.icon}')`
            };
            return (
                <div className="activityIcon" style={iconStyle}></div>
            );
        }
        return null;
    }

    renderHeroImage() {
        let summary = this.state.summary || {
            name: null,
            type: null,
            image: null,
            icon: null
        };

        let heroImageStyle = {
            background: summary.image
                ? `linear-gradient(${overlayColor}, ${overlayColor}), url('${summary.image}')`
                : overlayColor
        };
        let icon = this.renderIcon(summary);
        return (
            <div className="activityHeroImage" style={heroImageStyle}>
                <SmallHeader />
                <div className="activityHeroWrapper">
                    <div className="activityHeroContainer">
                        {icon}
                        <div className="activityHeroContent">
                            <p className="activityType">{summary.type}</p>
                            <p className="activityName">{summary.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderGroup(name, content) {
        return (
            <div className="detailsGroupContainer">
                <p className="detailsGroupName">{name}</p>
                <div className="detailsGroupSeparator" />
                {content}
            </div>
        );
    }

    renderDetails() {
        if (this.state.errorMessage) {
            return <div className="errorMessage">{this.state.errorMessage}</div>;
        }
        if (!this.state.details) {
            return <div className="errorMessage">Loading...</div>;
        }

        let modifiers = this.state.details.modifiers ?
            this.renderGroup('Modifiers', <ActivityModifiers modifiers={this.state.details.modifiers} />)
            : null;
        let rewards = this.state.details.rewards ?
            this.renderGroup('Rewards', <ActivityRewards rewards={this.state.details.rewards} />)
            : null;
        
        return (
            <div>
                {modifiers}
                {rewards}
            </div>
        );
    }

    render() {
        let hero = this.renderHeroImage();
        let details = this.renderDetails();

        return (
            <div>
                {hero}
                {details}
            </div>
        );
    };
}