import React from 'react';
import DestinyItem from './DestinyItem';

export default class VendorStock extends React.Component {
    renderCategory(category, i) {
        let items = category.items.map((item, n) =>
            <li key={n}>
                <DestinyItem item={item} />
            </li>);
        return (
            <div key={i}>
                <p className="detailsSubGroupName">{category.name}</p>
                <ul className="rewardSet">
                    {items}
                </ul>
            </div>
        );
    }

    render() {
        let categories = this.props.categories.map(
            (category, i) => this.renderCategory(category, i));
        return <div>{categories}</div>;
    };
};