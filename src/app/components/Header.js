import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <p className="headerLine1">Today in</p>
                    <p className="headerLine2">Destiny</p>
                </div>
                <div>
                    <p className="dateMonth">{this.props.date.month}</p>
                    <p className="dateDay">{this.props.date.day}</p>
                </div>
            </div>
        );
    };
}

export default Header;