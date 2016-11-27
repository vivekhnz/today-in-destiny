import React from 'react';

class Advisor extends React.Component {
    render() {
        return (
            <div className="advisorContainer">
                <p className="advisorType">{this.props.type}</p>
                <p className="advisorName">{this.props.name}</p>
                <p className="advisorTimeRemaining">{this.props.timeRemaining}</p>
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
        );
    };
}

export default Advisor;