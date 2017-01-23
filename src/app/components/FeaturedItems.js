import React from 'react';
import DestinyItem from './DestinyItem';

export default class FeaturedItems extends React.Component {
    render() {
        if (this.props.items) {
            let items = this.props.items.map((item, i) =>
                <li key={i}>
                    <DestinyItem item={item} />
                </li>);
            return <ul className="rewardSet">{items}</ul>;
        }
        return null;
    };
};