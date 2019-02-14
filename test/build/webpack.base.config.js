const path = require('path');
const {
  mainEntryName,
  vendorEntryName,
  commonEntryName,
  mainEntryPath,
  viewPath,
  extractCSS,
  
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
        use: extractCSS.extract({
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ],
          publicPath: '../'
        })
      },
      // css
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [
            'css-loader',
            'postcss-loader'
          ],
          publicPath: '../'
        })
      },
      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
  optimization: {
    //打包 第三方库
    //打包 公共文件
    splitChunks: {
      cacheGroups: {
        // node_modules内的依赖库
        [ vendorEntryName ]: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: vendorEntryName,
          // 被不同entry引用次数(import),1次的话没必要提取
          minChunks: 1,
          // entry 文件请求的chunks不应该超过此值（请求过多，耗时）
          maxInitialRequests: 5,
          // 最小尺寸必须大于此值，默认30000B
          minSize: 0,
          // 优先级，多个分组冲突时决定把代码放在哪块
          priority: 100
          // enforce: true?
        },
        // src 下的 公共 js 文件
        [ commonEntryName ]: {
          chunks: 'all',
          test: /[\\/]src[\\/]/,
          name: commonEntryName,
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1
        }
      }
    }
  },
  plugins: [
    // webpackHtmlPlugin
    ...getHtmlWebpackPlugin(),
    // css 提取成文件
    extractCSS
  ]
};
