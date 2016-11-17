var http = require('http')
const PORT = 3000

var requestHandler = (request, response) => {
    console.log(request.url)
    response.end("Today in Destiny")
}

var server = http.createServer(requestHandler)

server.listen(PORT, error => {
    if (error) {
        return console.log("An error occurred.", error)
    }
    
    console.log(`Server is listening on port ${PORT}`)
})