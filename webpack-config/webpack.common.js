const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../umd'),
    filename: 'build-object-better.[name].js',
    library: 'buildObjectBetter',
    libraryTarget: 'umd'
  }
}
