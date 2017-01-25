import React from 'react';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        e.preventDefault();
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        if (this.props.isOpen) {
            return (
                <div className="Modal" onClick={this.onClick}>
                    <div className="Modal-wrapper">
                        {this.props.children}
                    </div>
                </div>
            );
        }
        return null;
    };
};