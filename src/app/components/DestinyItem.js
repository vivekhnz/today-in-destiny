import React from 'react';
import Popover from 'react-popover';
import ItemPopover from './ItemPopover';

export default class DestinyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false
        };
    }

    togglePopover(newState = null) {
        this.setState({
            isPopupOpen: newState === null ? !this.state.isPopupOpen : newState
        });
    }

    render() {
        let armoryLink = `https://www.bungie.net/en/Armory/Detail?item=${this.props.item.hash}`;
        return (
            <Popover
                body={<ItemPopover item={this.props.item} />}
                isOpen={this.state.isPopupOpen}>
                <div className="destinyItem"
                    onMouseOver={() => this.togglePopover(true)}
                    onMouseOut={() => this.togglePopover(false)}>
                    <a href={armoryLink}>
                        <img src={this.props.item.icon} />
                    </a>
                </div>
            </Popover>
        );
    };
};