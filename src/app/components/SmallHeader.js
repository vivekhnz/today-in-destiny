import React from 'react';
import DateStore from '../stores/DateStore';

class SmallHeader extends React.Component {
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
            <div className="smallDateContainer">
                <p className="smallDate">{this.state.date.month} {this.state.date.day}</p>
            </div>
        );
    }

    render() {
        let dateContainer = this.state.date
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