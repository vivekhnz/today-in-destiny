import React from 'react';

class Advisor extends React.Component {
    render() {
        let overlayColor = 'rgba(39, 58, 65, 0.75)';
        let containerStyle = {
            background:
                `linear-gradient(${overlayColor}, ${overlayColor}),
                 url('${this.props.image}')`
        };

        return (
            <div className="advisorContainer" style={containerStyle}>
                <div className="advisorIcon" style={{backgroundImage: 'url(' + this.props.icon + ')'}} />
                <div className="advisorContentContainer">
                    <p className="advisorTimeRemaining">{this.props.timeRemaining}</p>
                    <p className="advisorType">{this.props.type}</p>
                    <p className="advisorName">{this.props.name}</p>
                    <ul>
                        {
                            this.props.items
                                ? this.props.items.map((item, i) =>
                                    <li key={i}>{item}</li>)
                                : null
                        }
                    </ul>
                    <ul>
                        {
                            this.props.modifiers
                                ? this.props.modifiers.map((modifier, i) =>
                                    <li key={i} className="advisorModifiers">{modifier}</li>)
                                : null
                        }
                    </ul>
                </div>
            </div>
        );
    };
}

export default Advisor;