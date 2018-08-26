'use strict';

const base = require('./webpack.base.conf');

module.exports = {
  ...base,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    // gzip 压缩
    compress: true
  }
};
