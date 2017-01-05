import React from 'react';

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

    renderRewardSet(name, items, i) {
        let rewards = items.map((item, n) =>
            <li key={n}>{item}</li>);
        return (
            <div key={i}>
                <p className="detailsSubGroupName">{name}</p>
                <ul>
                    {rewards}
                </ul>
            </div>
        );
    }

    renderRewardSets(rewardSets) {
        if (rewardSets) {
            let sets = [];
            let i = 0;
            for (let set in rewardSets) {
                sets.push(this.renderRewardSet(set, rewardSets[set], i))
                i++;
            }
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