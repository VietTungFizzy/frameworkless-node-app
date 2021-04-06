const { promises: {open}, readFileSync } = require('fs')
const HandleBars = require('handlebars')
const routes = require('../routes')
const basePage = readFileSync(`./templates/template.hbs`, {endcoding: 'utf8'})
const { STATIC_EXTENSIONS } = require('../config/constants')

const SAFE_FILE_PATTERN = /^\/?[a-zA-Z0-9_-]+\.[a-z]+$/

const { lookup } = require('mime-types')

const serveStaticFile = async ({path, extension, statusCode}, response) => {
    if(STATIC_EXTENSIONS.indexOf(extension) === -1) throw new Error('not found')
    if(!SAFE_FILE_PATTERN.test(path)) throw new Error('not found')

    let fileHandle

    try {
        fileHandle = await open(`./public/${path}`, 'r')
        const staticFile = await fileHandle.readFile()
        const mime = lookup(extension)
        if(!mime) throw new Error('not found')
        response.writeHead(statusCode || 200, {
            'Content-Type': mime
        })

        return response.end(staticFile)
    } catch(error) {
        console.error(error)
        throw new Error('not found')
    } finally {
        if(fileHandle) fileHandle.close()
    }
}

const serveRoute = async ({request, context}, response) => {
    const key = `${request.method}:${request.url}`
    if(!routes[key]) throw new Error('not found')
    const hbs = HandleBars.compile(basePage.toString())
    HandleBars.registerPartial('content', routes[key].body.toString())

    return response.end(hbs(context))
}

module.exports = { serveStaticFile, serveRoute}