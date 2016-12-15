import React from 'react';
import { Route } from 'react-router';
import App from './app/components/App';
import Home from './app/components/Home';
import Activity from './app/components/Activity';

let endpoints = {
    advisors: '/api/advisors'
};
let routes = (
    <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/activities/:id' component={Activity} />
    </Route>
);

export { endpoints, routes };