import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import swig from 'swig';
import path from 'path';

import routes from './app/routes.js';

var app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, 'public')));

function onNavigated(error, redirect, renderProps, response) {
    if (error) {
        response.status(500).send(error.message);
    }
    else if (redirect) {
        response.redirect(302, redirect.pathname + redirect.search);
    }
    else if (renderProps) {
        var html = ReactDOM.renderToString(
            <RouterContext {...renderProps} />);
        var page = swig.renderFile(
            __dirname + '/views/index.html', { html: html });
        response.status(200).send(page);
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