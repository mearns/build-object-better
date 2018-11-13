const merge = require('webpack-merge')
const commonProd = require('./webpack-config/webpack.prod.common.js')

module.exports = merge(commonProd, {
  entry: {
    min: './index.js'
  }
})
