if(!(process.env.PORT)) require('dotenv').config()

const { createServer } = require('http')

const { serveStaticFile, serveRoute} = require('../lib/responder')

const errors = require('../config/errors')

const {PORT, APP_NAME} = process.env

module.exports = () => {
    const server = createServer(async (request, response) => {
        const urlTokens = request.url.split('.')
        const extension = urlTokens.length > 1 ? `${urlTokens[urlTokens.length - 1].toLowerCase().trim()}` : false
        const serveResponse = extension ? serveStaticFile : serveRoute
        const responseParams = {path: request.url}
        if(extension) {
            responseParams.extension = extension
        } else {
            responseParams.request = request
            responseParams.context = {
                app_name: APP_NAME
            }
        }

        try {
            // console.log(await serveResponse(responseParams, response))
            return await serveResponse(responseParams, response)
        } catch(error) {
            console.log(error)
            const errorCode = errors(error)
            return await serveStaticFile({path: '/error.html', extension: 'html', statusCode: errorCode.code}, response)
        }
    })

    server.on('error', error => {
        console.error(`=> Error encountered: ${error.message}`)
        if(error.stack) console.error(error.stack)

        process.exit(1)
    })

    server.on('request', ({ method, url}) => {
        const now = new Date()
        console.info(`=> ${now.toUTCString()} - ${method} ${url}`)
    })

    server.listen(PORT, () => {
        console.log(`=> ${APP_NAME} running on port ${PORT}`)
    })
}