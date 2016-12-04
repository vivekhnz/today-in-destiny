import React from 'react';
import ElementQuery from 'react-element-query';

var overlayColor = 'rgba(39, 58, 65, 0.75)';
var wideViewWidth = 422;

class Advisor extends React.Component {
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
                                    <li key={i} className="advisorModifiers">
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
            background: `linear-gradient(${overlayColor}, ${overlayColor}),
                 url('${this.props.image}')`
        };
        let items = this.renderItems();
        let modifiers = this.renderModifiers();

        return (
            <ElementQuery sizes={[{ name: 'wide', width: wideViewWidth }]}>
                <div className="advisorBlock" style={blockStyle}>
                    <div className="advisorContainer">
                        <div className="advisorIcon" style={{ backgroundImage: 'url(' + this.props.icon + ')' }} />
                        <div className="advisorContent">
                            <p className="advisorTimeRemaining">{this.props.timeRemaining}</p>
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