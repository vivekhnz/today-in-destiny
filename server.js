var Express = require('express');
var React = require('react');
var ReactDOM = require('react-dom/server');
var swig = require('swig');
var App = require('./app/components/App.js');

var app = Express();
const PORT = process.env.PORT || 3000;

app.use('/bundle.js', (request, response) => {
    response.sendFile(__dirname + '/public/js/bundle.js');
});

app.use('/', (request, response) => {
    var element = React.createElement(App);
    var html = ReactDOM.renderToString(element);
    var page = swig.renderFile('views/index.html', { html: html });
    response.setHeader('Content-Type', 'text/html');
    response.end(page);
});

app.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error);
    }
    console.log(`Server is listening on port ${PORT}`);
});