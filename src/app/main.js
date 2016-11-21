import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

var element = React.createElement(App);
ReactDOM.render(element, document.getElementById('app'));