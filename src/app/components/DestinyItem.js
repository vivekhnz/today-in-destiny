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
        return (
            <div>
                <Popover
                    body={<ItemPopover item={this.props.item} />}
                    isOpen={this.state.isPopoverOpen}>
                    <div className="destinyItem"
                        onTouchStart={e => {
                            e.preventDefault();
                            this.setPopupState(null, true);
                        } }
                        onMouseEnter={() => this.setPopupState(true, null)}
                        onMouseLeave={() => this.setPopupState(false, null)}
                        onMouseDown={this.goToArmory}>
                        <img src={this.props.item.icon} />
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