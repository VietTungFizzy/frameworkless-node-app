const { open } = require('fs').promises

const { STATIC_EXTENSIONS } = require('../config/constants')

const serveStaticFile = async ({file, extension, statusCode}, response) => {
    if(STATIC_EXTENSIONS.indexOf(extension) === -1) throw new Error('not found')

    let fileHandle

    try {
        fileHandle = await open(`./public/${file}`, 'r')
        const staticFile = await fileHandle.readFile()
        return response.end(staticFile)
    } catch(error) {
        console.error(error)
        throw new Error('not found')
    } finally {
        if(fileHandle) fileHandle.close()
    }
}

module.exports = serveStaticFile