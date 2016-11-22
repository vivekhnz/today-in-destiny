import React from 'react';

class Advisor extends React.Component {
    render() {
        return (
            <div>
                <p>{this.props.type}</p>
                <p>{this.props.name}</p>
                <p>{this.props.timeRemaining}</p>
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
                                <li key={i}>{modifier}</li>)
                            : null
                    }
                </ul>
            </div>
        );
    };
}

export default Advisor;