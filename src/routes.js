import React from 'react';
import { Route } from 'react-router';
import App from './app/components/App';
import Home from './app/components/Home';
import AdvisorDetails from './app/components/AdvisorDetails';

let endpoints = {
    advisors: '/api/advisors',
    singleAdvisor: '/api/advisors/:id',
    categoryAdvisor: '/api/category/:category/:id'
};
let routes = (
    <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/:category/:id' component={AdvisorDetails} />
    </Route>
);

export { endpoints, routes };