require('dotenv').config()

const { createServer } = require('http')

const PORT = process.env.PORT || 1234

const server = createServer((request, response) => {
    return response.end("This is the response")
})

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})