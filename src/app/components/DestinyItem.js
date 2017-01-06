import React from 'react';

export default class DestinyItem extends React.Component {
    render() {
        let armoryLink = `https://www.bungie.net/en/Armory/Detail?item=${this.props.item.hash}`;
        return (
            <div className="destinyItem">
                <a href={armoryLink}>
                    <img src={this.props.item.icon} title={this.props.item.name} />
                    <div className="destinyItemText">
                        <p className="itemName">{this.props.item.name}</p>
                        <p className="itemType">{this.props.item.type}</p>
                    </div>
                </a>
            </div>
        );
    };
};