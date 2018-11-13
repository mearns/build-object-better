const fs = require('fs').promises
const path = require('path')
const Promise = require('bluebird')
const mkdirp = Promise.promisify(require('mkdirp'))

function makeModuleExport (sourceFile, destFile, targetName) {
  return fs.readFile(sourceFile)
    .then(content => {
      const fileData = content.toString('utf-8')
      return mkdirp(path.dirname(destFile))
        .then(() => fs.writeFile(destFile, `${fileData}\n\nmodule.exports = ${targetName}\n`))
    })
}

makeModuleExport(
  path.resolve(__dirname, '../index.js'),
  path.resolve(__dirname, '../dist/node/index.js'),
  'buildObjectBetter'
)
