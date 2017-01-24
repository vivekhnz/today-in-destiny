import React from 'react';
import DestinyItem from './DestinyItem';

export default class ActivityRewards extends React.Component {
    renderCurrencyItem(item, i) {
        let quantity = item.quantity;
        if (item.perCompletion) {
            if (item.quantity) {
                quantity = `${item.perCompletion} per completion (max ${item.quantity})`;
            }
            else {
                quantity = `${item.perCompletion} per completion`;
            }
        }
        return (
            <li key={i}>
                <img src={item.icon} />
                <p>{item.name} x {quantity}</p>
            </li>
        );
    }

    renderCurrencies(currencies) {
        if (currencies) {
            let items = currencies.map((item, i) => this.renderCurrencyItem(item, i));
            return <ul className="rewardCurrencies">{items}</ul>;
        }
        return null;
    }

    renderRewardSet(set, i) {
        let rewards = set.items.map((item, n) =>
            <li key={n}>
                <DestinyItem item={item} />
            </li>);
        return (
            <div key={i}>
                <p className="detailsSubGroupName">{set.name}</p>
                <ul className="rewardSet">
                    {rewards}
                </ul>
            </div>
        );
    }

    renderRewardSets(rewardSets) {
        if (rewardSets) {
            let sets = rewardSets.map((set, i) =>
                this.renderRewardSet(set, i));
            return <div>{sets}</div>;
        }
        return null;
    }

    render() {
        let currencies = this.renderCurrencies(this.props.rewards.currencies);
        let rewardSets = this.renderRewardSets(this.props.rewards.rewardSets);
        return (
            <div>
                {currencies}
                {rewardSets}
            </div>
        );
    };
};