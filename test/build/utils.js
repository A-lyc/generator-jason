const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const crypto = require('crypto');
const _ = require('lodash');

// 主入口名
const mainName = 'main';
// 主入口路径
const mainPath = path.resolve(__dirname, '../src/main.js');
// 网页目录路径
const viewPath = path.resolve(__dirname, '../src/views');

// 获取 views 数组
// 包含 路径，最后一级目录名，根据最后一级目录名加密后的 hash 值
const getViewObj = function () {
  let viewObj = [];
  // 所有入口 js 路径
  let entryJsArr = glob.sync(viewPath + '/**/*.js');
  entryJsArr.forEach(entryDir => {
    // 最后一级目录名称
    let lastDirName = _.nth(entryDir.split('/'), -2);
    // 根据最后一级目录名称计算出唯一的 hash 值作为 entry
    let entryHash = crypto.createHash('md5').update(lastDirName).digest('hex');
    // push
    viewObj.push({
      entryHash,
      entryDir,
      lastDirName
    });
  });
  // return
  return viewObj;
};
// 获取 entry 对象
const getEntry = function () {
  let viewObj = getViewObj();
  let entry = {};
  _.each(viewObj, ({ entryHash, entryDir, lastDirName }) => {
    entry[ entryHash ] = entryDir;
  });
  return entry;
};
// 获取多页面 webpackHtmlPlugins 数组
const getHtmlWebpackPlugin = function () {
  let htmlPluginArr = [];
  // 根据 entry 创建
  let viewObj = getViewObj();
  // 循环创建 htmlplugin 并返回数组
  _.each(viewObj, ({ entryHash, entryDir, lastDirName }) => {
    // 寻找同目录下的 ejs 文件
    let dirPath = entryDir.slice(0, entryDir.lastIndexOf('/'));
    // ejs 文件路径
    let ejsPath = glob.sync(dirPath + '/*.ejs')[ 0 ];
    // push webpackHtmlPlugin
    ejsPath && htmlPluginArr.push(new HtmlWebpackPlugin({
      filename: lastDirName + '.html',
      template: ejsPath,
      chunks: [ mainName, entryHash ]
    }));
  });
  // return
  return htmlPluginArr;
};

module.exports = {
  mainName,
  mainPath,
  viewPath,
  
  getViewObj,
  getEntry,
  getHtmlWebpackPlugin
};
