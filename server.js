var Express = require('express')
var React = require('react')
var ReactDOM = require('react-dom/server')
var App = require('./app/components/App.js')

var app = Express()
const PORT = process.env.PORT || 3000

app.get('/', (request, response) => {
    var element = React.createElement(App)
    var markup = ReactDOM.renderToString(element)
    response.send(markup)
})

app.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error)
    }
    
    console.log(`Server is listening on port ${PORT}`)
})