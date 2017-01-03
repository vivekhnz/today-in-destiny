import dotenv from 'dotenv';
dotenv.config();
if (!process.env.BUNGIE_API_KEY) {
    console.error("The 'BUNGIE_API_KEY' environment variable has not been set.");
    process.exit(1);
}

import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import alt from './app/alt';
import Iso from 'iso';
import swig from 'swig';
import path from 'path';

import { routes } from './routes.js';
import { default as api } from './services/api';

var app = Express();
const PORT = process.env.PORT || 3000;

api.registerEndpoints(app);

app.use(Express.static(path.join(__dirname, 'public')));

function renderPage(renderProps, data) {
    alt.bootstrap(JSON.stringify(data));
    let markup = ReactDOM.renderToString(
        <RouterContext {...renderProps} />);
    let html = Iso.render(markup, alt.flush());

    return swig.renderFile(
        __dirname + '/views/index.html', { html: html });
}

function onNavigated(error, redirect, renderProps, response) {
    if (error) {
        response.status(500).send(error.message);
    }
    else if (redirect) {
        response.redirect(302, redirect.pathname + redirect.search);
    }
    else if (renderProps) {
        api.getAdvisors()
            .then(advisors => {
                let data = {
                    AdvisorsStore: {
                        summaries: advisors.advisors.summaries,
                        categories: advisors.advisors.categories
                    },
                    DateStore: {
                        date: advisors.date
                    }
                };
                response.status(200).send(
                    renderPage(renderProps, data));
            })
            .catch(error => {
                console.log(error);
                response.status(200).send(
                    renderPage(renderProps, null));
            });
    }
    else {
        response.status(404).send('Not found');
    }
}

app.use('/', (request, response) => {
    match({ routes, location: request.url },
        (e, r, p) => onNavigated(e, r, p, response));
});

app.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error);
    }
    console.log(`Server is listening on port ${PORT}`);
});