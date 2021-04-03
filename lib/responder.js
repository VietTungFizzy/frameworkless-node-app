const { open } = require('fs').promises

const { STATIC_EXTENSIONS } = require('../config/constants')

const { lookup } = require('mime-types')

const serveStaticFile = async ({file, extension, statusCode}, response) => {
    if(STATIC_EXTENSIONS.indexOf(extension) === -1) throw new Error('not found')

    let fileHandle

    try {
        fileHandle = await open(`./public/${file}`, 'r')
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

module.exports = serveStaticFile