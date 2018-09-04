'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {
  readAllFiles
} = require('./utils');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 公共的JS文件名
const mainFileName = 'main.js';
// 公共JS入口位置
const mainPath = path.resolve(__dirname, '../src/main.js');
// 网页目录位置
const pagesPath = path.resolve(__dirname, '../src/pages');
// 输出目录
const outputPath = path.resolve(__dirname, '../dist');

// 注意：
//   entry 的 key 值为 目录名
module.exports = {
  entry: (() => {
    let entry = {
      main: mainPath
    };
    // 找到页面目录下的所有文件
    let filesNameArr = readAllFiles(pagesPath);
    // 找出 js 文件名，第一个匹配到的文件
    _.each(filesNameArr, fileNameArr => {
      let jsName = _.filter(fileNameArr, fileName => {
        return _.endsWith(fileName, '.js');
      })[ 0 ];
      // 给 entry 赋值
      entry[ fileNameArr.dirName ] = pagesPath + '/' + fileNameArr.dirName + '/' + jsName;
    });
    return entry;
  })(),
  output: {
    path: outputPath,
    filename: 'script/[name].js'
  },
  module: {
    rules: [
      // html
      {
        test: /\.(html)$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: [
                'img:src',
                'video:src',
                'source:src',
                'audio:src'
              ]
            }
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
              name: 'images/[name].[ext]'
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
              name: 'fonts/[name].[ext]'
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
              name: 'media/[name].[ext]'
            }
          }
        ]
      },
      // css
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      // js babel
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        verdor: {
          name: 'verdor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  plugins: [
    // CleanWebpackPlugin
    new CleanWebpackPlugin(outputPath),
    // HtmlWebpackPlugin
    ...(() => {
      let htmlPlugins = [];
      let filesNameArr = readAllFiles(pagesPath);
      // 找出所有html文件名
      _.each(filesNameArr, fileNameArr => {
        let dir = fileNameArr.dirName;
        let htmlName = _.filter(fileNameArr, fileName => {
          return _.endsWith(fileName, '.ejs');
        })[ 0 ];
        htmlPlugins.push(new HtmlWebpackPlugin({
          filename: dir + '.html',
          template: pagesPath + '/' + dir + '/' + htmlName,
          chunks: [
            mainFileName.replace('.js', ''),
            dir,
            'verdor'
          ]
        }));
      });
      return htmlPlugins;
    })()
  ]
};
