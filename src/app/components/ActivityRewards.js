import React from 'react';

export default class ActivityRewards extends React.Component {
    renderCurrencies(currencies) {
        if (currencies) {
            let items = currencies.map((item, i) => <li>{item.name} x {item.quantity}</li>);
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