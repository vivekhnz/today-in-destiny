import React from 'react';

class SmallHeader extends React.Component {
    renderDateContainer() {
        return (
            <div className="smallDateContainer">
                <p className="smallDate">{this.props.date.month} {this.props.date.day}</p>
            </div>
        );
    }

    render() {
        let dateContainer = this.props.date
            ? this.renderDateContainer()
            : null;
        return (
            <div className="smallHeaderContainer">
                {dateContainer}
                <div className="smallLogo" />
                <p className="smallHeaderText">Today in Destiny</p>
            </div>
        );
    };
}

export default SmallHeader;