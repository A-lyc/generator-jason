const path = require('path');
const utils = require('./utils');

module.exports = {
  entry: path.resolve(__dirname, '../src/pages/A/A.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  }
};
