import React from 'react';
import { Route } from 'react-router';
import App from './app/components/App';
import Home from './app/components/Home';

let endpoints = {
    advisors: '/api/advisors'
};
let routes = (
    <Route component={App}>
        <Route path='/' component={Home} />
    </Route>
);

export { endpoints, routes };