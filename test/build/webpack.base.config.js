const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {
  mainName,
  mainPath,
  viewPath,
  getEntry,
  getHtmlWebpackPlugin
} = require('./utils');

module.exports = {
  entry: {
    // 全局入口 js path
    [mainName]: mainPath,
    // 各页面入口 js path
    ...getEntry(path.resolve(viewPath))
  },
  output: {
    filename: `js/[chunkhash:8].js`
  },
  module: {
    rules: [
      // ejs
      {
        test: /\.(ejs)$/i,
        use: [
          {
            loader: 'ejs-loader'
          }
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ])
      },
      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `images/[hash:8].[ext]`
            }
          }
        ]
      },
      // 字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `fonts/[hash:8].[ext]`
            }
          }
        ]
      },
      // 视频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `media/[hash:8].[ext]`
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // webpackHtmlPlugin
    ...getHtmlWebpackPlugin(viewPath),
    // css
    new ExtractTextPlugin({
      filename: `css/[chunkhash:8].css`
    })
  ]
};