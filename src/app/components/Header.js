import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <p>Today in</p>
                    <p>Destiny</p>
                </div>
                <div>
                    <p>{this.props.month}</p>
                    <p>{this.props.day}</p>
                </div>
            </div>
        );
    };
}

export default Header;