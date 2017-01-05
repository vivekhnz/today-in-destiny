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

    render() {
        let currencies = this.renderCurrencies(this.props.rewards.currencies);
        return (
            <div>
                {currencies}
            </div>
        );
    };
};