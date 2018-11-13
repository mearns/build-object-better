const merge = require('webpack-merge')
const common = require('./webpack-config/webpack.common.js')

module.exports = merge(common, {
  entry: {
    dev: './index.js'
  },
  mode: 'development',
  devtool: 'inline-source-map'
})
