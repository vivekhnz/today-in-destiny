import React from 'react';
import alt from '../alt.js';

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    };
}

export default App;