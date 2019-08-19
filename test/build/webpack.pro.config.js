const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const _ = require('lodash')
const baseConfig = require('./webpack.base.config')

module.exports = merge({}, baseConfig, {
  optimization: {
    minimizer: [
      // 删除 console
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_debugger: true,
            drop_console: false
          }
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
})
