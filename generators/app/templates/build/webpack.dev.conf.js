const _ = require('lodash');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.conf');
const envDev = require('../config/env.dev');

// 处理成 JSON
_.each(envDev, (val, key) => {
  envDev[ key ] = JSON.stringify(val);
});

module.exports = merge(base, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    // gzip 压缩
    compress: true,
    stats: 'minimal'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': envDev
    })
  ]
});
