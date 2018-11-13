const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyEsPlugin = require('uglifyes-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyEsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: true,
          mangle: {
            properties: true
          }
        }
      })
    ]
  }
})
