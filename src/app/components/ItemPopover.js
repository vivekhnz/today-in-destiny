import React from 'react';

let ITEM_TIER_COLORS = {
    Common: '#B7B1AA',
    Uncommon: '#366F42',
    Rare: '#5076A3',
    Legendary: '#522F65',
    Exotic: '#CEAE33'
};

export default class ItemPopover extends React.Component {
    renderHeader() {
        let headerStyle = {};
        let tierColor = ITEM_TIER_COLORS[this.props.item.tier];
        if (tierColor) {
            headerStyle.background = tierColor;
        }
        return (
            <div className='popupHeader'
                style={headerStyle}>
                <img className="itemIcon" src={this.props.item.icon} />
                <div className="textContainer">
                    <p className="itemName">{this.props.item.name}</p>
                    <p className="itemType">{this.props.item.type}</p>
                </div>
            </div>
        );
    }

    renderStat(stat, i) {
        return (
            <span key={i} className="secondaryStat">
                <span className="statName">{stat.name}</span>
                <span className="statValue"> +{stat.value}</span>
            </span>
        );
    }

    renderStats(stats) {
        if (stats) {
            let primary = stats.primary ?
                <p className="primaryStat">
                    <span className="statValue">{stats.primary.value}</span>
                    <span className="statName">{stats.primary.name}</span>
                </p> : null;
            let secondary = stats.secondary ?
                stats.secondary.map(
                    (stat, i) => this.renderStat(stat, i))
                : null;
            return (
                <div>
                    {primary}
                    {secondary}
                </div>
            );
        }
        return null;
    }

    renderPerk(item, i) {
        return (
            <li key={i}>
                <img src={item.icon} />
                <p>{item.description}</p>
            </li>
        );
    }

    renderPerks() {
        if (this.props.item.perks) {
            let items = this.props.item.perks.map(
                (item, i) => this.renderPerk(item, i));
            return <ul className="perks">{items}</ul>;
        }
        return null;
    }

    renderContent() {
        let stats = this.renderStats(this.props.item.stats);
        let perks = this.renderPerks();

        // only show description if item has no stats or perks
        let description = undefined;
        if (!stats && !perks) {
            if (!this.props.item.description) {
                return null;
            }
            description = (
                <p className="itemDescription">
                    {this.props.item.description}
                </p>
            );
        }

        let separator = stats && perks ?
            <hr /> : null;
        return (
            <div className='popupContent'>
                {stats}
                {separator}
                {perks}
                {description}
            </div>
        );
    }

    renderCost(item, i) {
        return (
            <li key={i}>
                <img src={item.icon} />
                <p>{item.name} x {item.quantity}</p>
            </li>
        );
    }

    renderCosts() {
        if (this.props.item.costs) {
            let items = this.props.item.costs.map(
                (item, i) => this.renderCost(item, i));
            return <ul>{items}</ul>;
        }
        return null;
    }

    render() {
        let header = this.renderHeader();
        let content = this.renderContent();
        let costs = this.renderCosts();
        return (
            <div className='itemDetailsPopover'>
                {header}
                {content}
                <div className='popupCosts'>
                    {costs}
                </div>
            </div>
        );
    }
};