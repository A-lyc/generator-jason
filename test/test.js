const { getEntry, getHtmlWebpackPlugin } = require('./build/utils');

console.log(getEntry());
console.log(getHtmlWebpackPlugin().length);