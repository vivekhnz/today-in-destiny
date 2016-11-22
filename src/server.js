import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import swig from 'swig';
import path from 'path';

import App from './app/components/App.js';

var app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.static(path.join(__dirname, 'public')));

app.use('/', (request, response) => {
    var html = ReactDOM.renderToString(<App/>);
    var page = swig.renderFile(
        __dirname + '/views/index.html', { html: html });
    response.setHeader('Content-Type', 'text/html');
    response.end(page);
});

app.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error);
    }
    console.log(`Server is listening on port ${PORT}`);
});