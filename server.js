var express = require('express')
var app = express()
const PORT = 3000

app.get('/', (request, response) => {
    console.log(request.url)
    response.send('Today in Destiny')
})

app.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error)
    }
    
    console.log(`Server is listening on port ${PORT}`)
})