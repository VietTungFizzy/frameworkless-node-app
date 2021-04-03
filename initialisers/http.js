if(!(process.env.PORT)) require('dotenv').config()

const { createServer } = require('http')

const serveStaticFile = require('../lib/responder')

const {PORT, APP_NAME} = process.env

module.exports = () => {
    const server = createServer(async ({url}, response) => {
        const urlTokens = url.split('.')
        const extension = urlTokens.length > 1 ? `${urlTokens[urlTokens.length - 1].toLowerCase().trim()}` : false
        const isRoot = ['', '/'].indexOf(url) > -1
        const path = isRoot ? '/index.html' : url

        try {
            return await serveStaticFile({file: path, extension: isRoot ? 'html' : extension}, response)
        } catch(error) {
            console.log(error)
            return await serveStaticFile({file: '/error.html', extension: 'html', statusCode: 500}, response)
        }
    })

    server.on('request', ({ method, url}) => {
        const now = new Date()
        console.info(`=> ${now.toUTCString()} - ${method} ${url}`)
    })

    server.listen(PORT, () => {
        console.log(`=> ${APP_NAME} running on port ${PORT}`)
    })
}