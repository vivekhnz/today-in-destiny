import React from 'react';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        document.body.classList.toggle('noScroll', this.props.isOpen);
    }

    componentWillReceiveProps(newProps) {
        document.body.classList.toggle('noScroll', newProps.isOpen);
    }

    componentWillUnmount() {
        document.body.classList.remove('noScroll');
    }

    onClick(e) {
        e.preventDefault();
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        let isOpen = this.props.isOpen ? 'isOpen' : '';
        return (
            <div className={`Modal ${isOpen}`} onClick={this.onClick}>
                <div className="Modal-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    };
};