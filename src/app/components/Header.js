import React from 'react';

class Header extends React.Component {
    renderDateContainer() {
        return (
            <div className="dateContainer">
                <p className="dateMonth">{this.props.date.month}</p>
                <p className="dateDay">{this.props.date.day}</p>
                <div className="dateEdgeLeft" />
                <div className="dateEdgeRight" />
            </div>);
    }

    render() {
        let dateContainer = this.props.date
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