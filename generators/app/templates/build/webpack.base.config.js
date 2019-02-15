const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  mainEntryName,
  vendorEntryName,
  commonEntryName,
  mainEntryPath,
  viewPath,
  
  getEntry,
  getHtmlWebpackPlugin
} = require('./utils');

module.exports = {
  entry: {
    // 全局入口 js path
    [ mainEntryName ]: mainEntryPath,
    // 各页面入口 js path
    ...getEntry()
  },
  output: {
    filename: `js/[name].js`
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      // css
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      // js
      {
        test: /\.js$/,
        exclude: __dirname + 'node_modules',
        include: __dirname + 'src',
        loader: 'babel-loader'
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `image/[hash:8].[ext]`
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
              name: `font/[hash:8].[ext]`
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
              name: `media/[hash:8].[ext]`
            }
          }
        ]
      }
    ]
  },
  optimization: {
    //打包 第三方库
    //打包 公共文件
    splitChunks: {
      cacheGroups: {
        // node_modules
        [ vendorEntryName ]: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: vendorEntryName,
          // 被不同entry引用次数(import),1次的话没必要提取
          minChunks: 1,
          // entry 文件请求的chunks不应该超过此值（请求过多，耗时）
          maxInitialRequests: 5,
          // 最小尺寸必须大于此值，默认30000B
          minSize: 0
        },
        // assets
        // components
        [ commonEntryName ]: {
          chunks: 'all',
          test: /[\\/]src[\\/]assets|[\\/]src[\\/]components/,
          name: commonEntryName,
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0
        }
      }
    }
  },
  plugins: [
    // webpackHtmlPlugin
    ...getHtmlWebpackPlugin(),
    // css 提取成文件
    new MiniCssExtractPlugin({
      filename: `css/[name].css`
    }),
    // 将所有模块中都默认引入 jQuery
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ]
};
