const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const config = require('../config');
const {
  readAllFiles,
  styleLoaders,
  stylePlugins,
  exposeLoaders
} = require('./utils');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 公共的JS文件名
const mainFileName = 'main.js';
// 公共JS入口位置
const mainPath = path.resolve(__dirname, '../src/main.js');
// 网页目录位置
const viewPath = path.resolve(__dirname, '../src/views');
// 输出目录
const outputPath = path.resolve(__dirname, '../dist');

// 第三方模块 chunk 名
const verdor = 'verdor';

// 注意：
//   entry 的 key 值为 目录名
module.exports = {
  entry: (() => {
    let entry = {
      main: mainPath
    };
    // 找到页面目录下的所有文件
    let filesNameArr = readAllFiles(viewPath);
    // 找出 js 文件名，第一个匹配到的文件
    _.each(filesNameArr, fileNameArr => {
      let jsName = _.filter(fileNameArr, fileName => {
        return _.endsWith(fileName, '.js');
      })[ 0 ];
      // 给 entry 赋值
      entry[ fileNameArr.dirName ] = viewPath + '/' + fileNameArr.dirName + '/' + jsName;
    });
    return entry;
  })(),
  output: {
    path: outputPath,
    filename: 'script/[name].js'
  },
  module: {
    rules: [
      // style loader
      ...styleLoaders(),
      // expose loader
      ...exposeLoaders(),
      // ejs
      {
        test: /\.(ejs)$/i,
        use: [
          {
            loader: 'ejs-loader'
          }
        ]
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `images/[${config.hash ? 'chunkhash' : 'name'}].[ext]`
            }
          }
        ]
      },
      // 字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `fonts/[${config.hash ? 'chunkhash' : 'name'}].[ext]`
            }
          }
        ]
      },
      // 视频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `media/[${config.hash ? 'chunkhash' : 'name'}].[ext]`
            }
          }
        ]
      },
      // js babel
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        [ verdor ]: {
          name: verdor,
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  plugins: [
    // 清除打包目录
    new CleanWebpackPlugin(outputPath),
    // HtmlWebpackPlugin
    ...(() => {
      let htmlPlugins = [];
      let filesNameArr = readAllFiles(viewPath);
      // 找出所有html文件名
      _.each(filesNameArr, fileNameArr => {
        let dir = fileNameArr.dirName;
        let htmlName = _.filter(fileNameArr, fileName => {
          return _.endsWith(fileName, '.ejs');
        })[ 0 ];
        htmlPlugins.push(new HtmlWebpackPlugin({
          filename: dir + '.html',
          template: viewPath + '/' + dir + '/' + htmlName,
          chunks: [
            mainFileName.replace('.js', ''),
            dir,
            verdor
          ]
        }));
      });
      return htmlPlugins;
    })(),
    // extract-text-webpack-plugin
    ...stylePlugins()
  ]
};
