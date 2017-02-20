import React from 'react';
import { browserHistory } from 'react-router';
import ElementQuery from 'react-element-query';
import { default as time } from '../../services/time';

var overlayColor = 'rgba(39, 58, 65, 0.75)';
var wideViewWidth = 422;

class Advisor extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        e.preventDefault();
        if (this.props.category && this.props.shortID) {
            browserHistory.push(`/${this.props.category}/${this.props.shortID}`);
        }
    }

    renderIcon() {
        if (this.props.icon) {
            return (
                <div className="advisorIcon" style={{ backgroundImage: 'url(' + this.props.icon + ')' }} />
            );
        }
        return null;
    }

    renderTimeRemaining() {
        if (this.props.expiresAt) {
            let duration = time.until(this.props.expiresAt);
            let timeRemaining = time.formatDuration(duration);
            return (
                <p className="advisorTimeRemaining">{timeRemaining}</p>
            );
        }
        return null;
    }

    renderItems() {
        if (this.props.items) {
            return (
                <div>
                    <div className="advisorSeparator" />
                    <ul className="advisorItems">
                        {
                            this.props.items
                                ? this.props.items.map((item, i) =>
                                    <li key={i}><img src={item.icon} title={item.name} /></li>)
                                : null
                        }
                    </ul>
                </div>
            );
        }
        return null;
    }

    renderModifiers() {
        if (this.props.modifiers) {
            return (
                <div>
                    <div className="advisorSeparator" />
                    <ul className="advisorModifiers">
                        {
                            this.props.modifiers
                                ? this.props.modifiers.map((modifier, i) =>
                                    <li key={i}>
                                        <img src={modifier.icon} title={modifier.name} />
                                        <p>{modifier.name}</p>
                                    </li>)
                                : null
                        }
                    </ul>
                </div>
            );
        }
        return null;
    }

    render() {
        let blockStyle = {
            background: this.props.image
                ? `linear-gradient(${overlayColor}, ${overlayColor}), url('${this.props.image}')`
                : overlayColor
        };
        let icon = this.renderIcon();
        let timeRemaining = this.renderTimeRemaining();
        let items = this.renderItems();
        let modifiers = this.renderModifiers();
        let hasTarget = this.props.id ? 'hasTarget' : '';

        return (
            <ElementQuery sizes={[{ name: 'wide', width: wideViewWidth }]}>
                <div className={`masonryItem advisorBlock ${hasTarget}`}
                    style={blockStyle}
                    onClick={this.onClick}>
                    <div className="advisorContainer">
                        {icon}
                        <div className="advisorContent">
                            {timeRemaining}
                            <p className="advisorType">{this.props.type}</p>
                            <p className="advisorName">{this.props.name}</p>
                            {items}
                            {modifiers}
                        </div>
                    </div>
                </div>
            </ElementQuery>
        );
    };
}

export default Advisor;