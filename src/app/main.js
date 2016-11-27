import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import alt from './alt';
import Iso from 'iso';

import routes from './routes';

Iso.bootstrap((state, meta, container) => {
    alt.bootstrap(state);
    ReactDOM.render(
        <Router history={browserHistory}>{routes}</Router>,
        document.getElementById('app'));
});