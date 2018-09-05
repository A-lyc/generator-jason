const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.conf');

module.exports = merge(base, {
  stats: 'errors-only',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
