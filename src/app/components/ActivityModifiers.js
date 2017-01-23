import React from 'react';

export default class ActivityModifiers extends React.Component {
    renderModifier(item, i) {
        return (
            <li key={i}>
                <div className="modifierIcon">
                    <img src={item.icon} />
                </div>
                <div className="modifierContent">
                    <p className="modifierName">{item.name}</p>
                    <p className="modifierDescription">{item.description}</p>
                </div>
            </li>
        );
    }

    render() {
        if (this.props.modifiers) {
            let items = this.props.modifiers.map((item, i) => this.renderModifier(item, i));
            return <ul className="modifierDetails">{items}</ul>;
        }
        return null;
    };
};