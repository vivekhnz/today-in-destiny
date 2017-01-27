import React from 'react';
import Popover from 'react-popover';
import Modal from './Modal';
import ItemPopover from './ItemPopover';

export default class DestinyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopoverOpen: false,
            isModalOpen: false
        };
        this.goToArmory = this.goToArmory.bind(this);
    }

    goToArmory(e) {
        e.preventDefault();
        let armoryLink = `https://www.bungie.net/en/Armory/Detail?item=${this.props.item.hash}`;
        window.open(armoryLink, '_blank');
    }

    setPopupState(popover = null, modal = null) {
        let newState = {};
        if (popover != null) {
            newState.isPopoverOpen = popover;
        }
        if (modal != null) {
            newState.isModalOpen = modal;
        }
        this.setState(newState);
    }

    render() {
        let stackSize = this.props.item.quantity > 1 ?
            <span className="stackSize">{this.props.item.quantity}</span>
            : null;
        return (
            <div>
                <Popover
                    body={<ItemPopover item={this.props.item} />}
                    isOpen={this.state.isPopoverOpen}>
                    <div className="destinyItem"
                        onMouseOver={() => this.setPopupState(true, null)}
                        onMouseOut={() => this.setPopupState(false, null)}
                        onClick={() => this.setPopupState(false, true)}>
                        <img src={this.props.item.icon} />
                        {stackSize}
                    </div>
                </Popover>
                <Modal isOpen={this.state.isModalOpen}
                    onClose={() => this.setPopupState(null, false)}>
                    <ItemPopover item={this.props.item} />
                    <div className="Button"
                        style={{ margin: '0px 8px 8px 8px' }}
                        onClick={this.goToArmory}>
                        View in Bungie.net Armory
                    </div>
                </Modal>
            </div>
        );
    };
};