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

// entry
let entry = () => {
  let entry = { main: [ mainPath ] };
  // babel-polyfill
  if (config.babelPolyfill) {
    entry.main.unshift('babel-polyfill');
  }
  // 读取视图目录
  // 将返回二维数组（每个二维数组代表一个网页）
  let views = readAllFiles(viewPath);
  // 循环找视图视图入口 给 entry 赋值
  _.each(views, view => {
    // 页面入口文件名
    let jsFileName = _.filter(view, fileName => {
      return _.endsWith(fileName, '.js');
    })[ 0 ];
    // 赋值 entry
    entry[ view.dirName ] = viewPath + '/' + view.dirName + '/' + jsFileName;
  });
  return entry;
};
// htmlPlugins
let htmlPlugins = () => {
  let htmlPlguins = [];
  // 获取所有视图目录（二维数组）
  let views = readAllFiles(viewPath);
  // 找出 每个目录下的 ejs 文件名
  // 给 htmlPlugins 赋值
  _.each(views, view => {
    let htmlFileName = _.filter(view, fileName => {
      return _.endsWith(fileName, '.ejs');
    })[ 0 ];
    htmlPlguins.push(new HtmlWebpackPlugin({
      filename: view.dirName + '.html',
      template: viewPath + '/' + view.dirName + '/' + htmlFileName,
      minify: (() => {
        // 测试不压缩
        if (process.env.NODE_ENV === 'development') {
          return false;
        }
        // 是否开启
        else if (config.htmlMinify === false) {
          return false;
        }
        else {
          return {
            // 删去属性值的引号
            removeAttributeQuotes: true,
            // 删除空格
            collapseWhitespace: true,
            // 删除注释
            removeComments: true
          };
        }
      })(),
      chunks: [
        'verdor',
        'main',
        view.dirName
      ]
    }));
  });
  return htmlPlguins;
};
// plugins
let plguins = () => {
  return [
    // 清除打包目录
    new CleanWebpackPlugin([ 'dist' ], {
      root: path.resolve(__dirname, '../')
    }),
    // extract-text-webpack-plugin
    ...stylePlugins(),
    // HtmlWebpackPlugin
    ...htmlPlugins()
  ];
};

// 注意：
// entry 的 key 值为 目录名
module.exports = {
  entry: entry(),
  output: {
    filename: `script/[${config.hash ? 'chunkhash' : 'name'}].js`
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
              name: `images/[${config.hash ? 'hash' : 'name'}].[ext]`
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
              name: `fonts/[${config.hash ? 'hash' : 'name'}].[ext]`
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
              name: `media/[${config.hash ? 'hash' : 'name'}].[ext]`
            }
          }
        ]
      },
      // js babel
      {
        test: /\.js$/i,
        exclude: '/node_modules/',
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
        verdor: {
          name: 'verdor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  plugins: plguins()
};
