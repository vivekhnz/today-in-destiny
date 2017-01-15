import React from 'react';
import Popover from 'react-popover';

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

    renderPopover() {
        return (
            <div className='itemDetailsPopover'>
                <div className='popupContent'>
                    <p className="itemName">{this.props.item.name}</p>
                    <p className="itemType">{this.props.item.type}</p>
                </div>
            </div>
        );
    }

    render() {
        let armoryLink = `https://www.bungie.net/en/Armory/Detail?item=${this.props.item.hash}`;
        let popover = this.renderPopover();
        return (
            <Popover
                body={popover}
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