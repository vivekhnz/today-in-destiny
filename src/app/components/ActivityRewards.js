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
        return <li key={i}>{item.name} x {quantity}</li>;
    }

    renderCurrencies(currencies) {
        if (currencies) {
            let items = currencies.map((item, i) => this.renderCurrencyItem(item, i));
            return <ul>{items}</ul>;
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