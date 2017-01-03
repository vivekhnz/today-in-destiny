import React from 'react';
import { Route } from 'react-router';
import App from './app/components/App';
import Home from './app/components/Home';
import AdvisorDetails from './app/components/AdvisorDetails';

let endpoints = {
    advisors: '/api/advisors',
    singleAdvisor: '/api/advisors/:id'
};
let routes = (
    <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/activities/:id' component={AdvisorDetails} />
    </Route>
);

export { endpoints, routes };