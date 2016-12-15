import React from 'react';

class Activity extends React.Component {
    render() {
        return (
            <div className="groupHeader">{this.props.params.id}</div>
        );
    };
}

export default Activity;