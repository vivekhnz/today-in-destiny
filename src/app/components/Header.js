import React from 'react';
import DateStore from '../stores/DateStore';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = DateStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        DateStore.listen(this.onChange);
    }

    componentWillUnmount() {
        DateStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    renderDateContainer() {
        return (
            <div className="dateContainer">
                <p className="dateMonth">{this.state.date.month}</p>
                <p className="dateDay">{this.state.date.day}</p>
                <div className="dateEdgeLeft" />
                <div className="dateEdgeRight" />
            </div>);
    }

    render() {
        let dateContainer = this.state.date
            ? this.renderDateContainer()
            : null;
        return (
            <div className="headerContainer">
                {dateContainer}
                <div className="logoContainer">
                    <div className="logo"/>
                </div>
                <div className="headerTextContainer">
                    <p className="headerLine1">Today in</p>
                    <p className="headerLine2">Destiny</p>
                </div>
            </div>
        );
    };
}

export default Header;