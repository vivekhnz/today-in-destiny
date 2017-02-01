import React from 'react';
import { browserHistory } from 'react-router';

import SmallHeader from './SmallHeader';
import ActivityRewards from './ActivityRewards';
import ActivityModifiers from './ActivityModifiers';
import FeaturedItems from './FeaturedItems';
import VendorStock from './VendorStock';

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
            DetailsActions.fetchAdvisor(
                this.props.params.category, this.props.params.id);
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
        if (prevProps.params.category !== this.props.params.category
            || prevProps.params.id !== this.props.params.id) {
            this.update();
        }
    }

    getAdvisorSummary(categories, categoryID, advisorID) {
        for (let c = 0; c < categories.length; c++) {
            let category = categories[c];
            if (category.id === categoryID) {
                for (let a = 0; a < category.advisors.length; a++) {
                    let advisor = category.advisors[a];
                    if (advisor.shortID === advisorID) {
                        return advisor;
                    }
                }
            }
        }
        return null;
    }

    onAdvisorsChanged(advisors) {
        if (advisors) {
            if (advisors.categoryMap) {
                let category = advisors.categoryMap[this.props.params.category];
                if (category) {
                    let advisorID = category[this.props.params.id];
                    if (advisorID) {
                        this.setState({
                            advisorID: advisorID
                        });
                    }
                }
            }
            if (advisors.categories) {
                let summary = this.getAdvisorSummary(
                    advisors.categories,
                    this.props.params.category,
                    this.props.params.id);
                if (summary) {
                    this.setState({
                        summary: summary
                    });
                }
            }
        }
    }

    onDetailsChanged(store) {
        if (store) {
            if (store.errorMessage) {
                console.log(store.errorMessage);
                // send us back to the homepage if there's an error
                browserHistory.push('/');
                // clear the error
                store.errorMessage = null;
            }
            else if (store.details && this.state.advisorID) {
                let details = store.details[this.state.advisorID];
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

    renderGroup(name, content, key = undefined) {
        return (
            <div key={key}>
                <p className="detailsGroupName">{name}</p>
                <div className="detailsGroupSeparator" />
                {content}
            </div>
        );
    }

    renderDetails() {
        if (!this.state.details) {
            return <div className="errorMessage">Loading...</div>;
        }

        let modifiers = this.state.details.modifiers ?
            this.renderGroup('Modifiers', <ActivityModifiers modifiers={this.state.details.modifiers} />)
            : null;
        let rewards = this.state.details.rewards ?
            this.renderGroup('Rewards', <ActivityRewards rewards={this.state.details.rewards} />)
            : null;

        // render vendor stock
        let featuredItems = null;
        let otherItems = null;
        if (this.state.details.stock) {
            let stock = this.state.details.stock;
            featuredItems = stock.featured ?
                this.renderGroup(stock.featured.name,
                    <FeaturedItems items={stock.featured.items} />)
                : null;

            if (stock.other) {
                otherItems = stock.other.map((vendor, i) =>
                    this.renderGroup(vendor.name,
                        <VendorStock categories={vendor.categories} />,
                        `otherItems-${i}`));
            }
        }

        return (
            <div className="detailsGroups">
                {modifiers}
                {featuredItems}
                <div>
                    {otherItems}
                </div>
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