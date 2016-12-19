import React from 'react';
import alt from '../alt.js';

import Footer from './Footer';

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
                <Footer />
            </div>
        );
    };
}

export default App;