const _ = require('lodash');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.conf');
const envPro = require('../config/env.pro');

// 处理成 JSON
_.each(envPro, (val, key) => {
  envPro[ key ] = JSON.stringify(val);
});

module.exports = merge(base, {
  stats: 'errors-only',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': envPro
    })
  ]
});
