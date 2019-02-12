const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const _ = require('lodash');

// 主入口名
const mainName = 'main';
// 主入口路径
const mainPath = path.resolve(__dirname, '../src/main.js');
// 网页目录路径
const viewPath = path.resolve(__dirname, '../src/views');
// 获取多页面 entry 对象
// 注意：entry 对象的 key 为最后一级目录名
const getEntry = function () {
  let entry = {};
  // 所有入口 js 路径
  let entryJsArr = glob.sync(viewPath + '/**/*.js');
  // 给 entry 赋值，key 为 路径
  entryJsArr.forEach(item => {
    // key 为 最后一级目录名
    let key = _.nth(item.split('/'), -2);
    entry[ key ] = item;
  });
  // return
  return entry;
};
// 获取多页面 webpackHtmlPlugins 数组
const getHtmlWebpackPlugin = function () {
  let htmlPluginArr = [];
  // 根据 entry 创建
  let entry = getEntry();
  // 循环创建 htmlplugin 并返回数组
  _.each(entry, (value, key) => {
    // 寻找同目录下的 ejs 文件
    let dirPath = value.slice(0, value.lastIndexOf('/'));
    // ejs 文件路径
    let ejsPath = glob.sync(dirPath + '/*.ejs')[ 0 ];
    // push webpackHtmlPlugin
    ejsPath && htmlPluginArr.push(new HtmlWebpackPlugin({
      filename: key + '.html',
      template: ejsPath,
      chunks: [ mainName, key ]
    }));
  });
  // return
  return htmlPluginArr;
};

module.exports = {
  mainName,
  mainPath,
  viewPath,
  getEntry,
  getHtmlWebpackPlugin
};
