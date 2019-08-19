const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const glob = require('glob')
const crypto = require('crypto')
const _ = require('lodash')

// 主入口名
const mainEntryName = 'main'
// node_modules 内的依赖库入口名
const vendorEntryName = 'vendor'
// src js 中的公共模块入口名（component，或封装的工具 js）
const commonEntryName = 'common'
// 主入口路径
const mainEntryPath = path.resolve(__dirname, '../src/main.js')
// 网页目录路径
const viewPath = path.resolve(__dirname, '../src/views')
// 各页面入口信息数组
const viewEntryDataArr = (function () {
  // 所有页面的 entry js 路径
  let entryPathArr = glob.sync(viewPath + '/**/index.js')
  
  return _.map(entryPathArr, path => {
    // 获取目录名作为名称
    // 这里有些问题，其他系统电脑的 '/' 可能是 '\'
    // 身边没有电脑，待解决
    let name = _.nth(path.split('/'), -2)
    // 根据名称算出 hash 值
    let hash = crypto.createHash('md5').update(name).digest('hex')
    // return obj
    return { path, name, hash }
  })
})()
// entry 对象
const viewEntryObj = (function () {
  let obj = {}
  _.each(viewEntryDataArr, data => {
    obj[ data.hash ] = data.path
  })
  return obj
})()
// 获取多页面 webpackHtmlPlugins 数组
const htmlWebpackPluginArr = (function () {
  return _.map(viewEntryDataArr, ({ path, name, hash }) => {
    // 目录路径
    let dirPath = path.slice(0, path.lastIndexOf('/'))
    // ejs路径
    let ejsPath = glob.sync(dirPath + '/*.ejs')[ 0 ]
    
    return new HtmlWebpackPlugin({
      filename: name + '.html',
      template: ejsPath,
      chunks: [vendorEntryName, commonEntryName, mainEntryName, hash]
    })
  })
})()

module.exports = {
  mainEntryName,
  vendorEntryName,
  commonEntryName,
  mainEntryPath,
  viewPath,
  viewEntryDataArr,
  viewEntryObj,
  htmlWebpackPluginArr
}
