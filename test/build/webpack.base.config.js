const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const crypto = require('crypto')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const _ = require('lodash')

let pageHelper = (function () {
  let entryPathArr = glob.sync(path.resolve(__dirname, '../src/views') + '/**/index.js')
  return _.map(entryPathArr, entryPath => {
    // ejs 模板路径
    let templatePath = entryPath.replace('.js', '.ejs')
    // 统一不同系统之间的斜杠
    let formatEntryPath = entryPath.replace(/\\/g, '/')
    // 页面目录名
    let dirname = _.nth(formatEntryPath.split('/'), -2)
    // 页面独有的 hash 名 (根据页面目录名计算而来)
    let hash = crypto.createHash('md5').update(dirname).digest('hex')
    
    return {
      dirname,
      hash,
      entryPath,
      templatePath
    }
  })
})()
let pageEntry = (function () {
  let obj = {}
  pageHelper.forEach(page => {
    obj[ page.hash ] = page.entryPath
  })
  return obj
})()
let htmlPluginArr = (function () {
  return _.map(pageHelper, page => {
    return new HtmlWebpackPlugin({
      filename: page.dirname + '.html',
      template: page.templatePath,
      chunks: [ 'vendor', 'common', 'main', page.hash ]
    })
  })
})()

// 管理员
let adminEntryPath = path.resolve(__dirname, '../admin/index.js')
let adminTemplatePath = path.resolve(__dirname, '../admin/index.ejs')

// 将页面目录管理员 data.json 文件
fs.writeFileSync(
  path.resolve(__dirname, '../admin/data.json'),
  JSON.stringify(pageHelper)
)

module.exports = {
  devtool: 'source-map',
  entry: {
    admin: adminEntryPath,
    main: path.resolve(__dirname, '../src/main.js'),
    ...pageEntry
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
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'expanded'
            }
          }
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
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
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
            loader: 'file-loader',
            options: {
              name: `image/[name].[ext]`
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
              limit: true
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
              name: `media/[name].[ext]`
            }
          }
        ]
      },
      // 全局暴漏 jQuery 和 $
      // 注意：必须在 js 中引入一次才行
      // 推荐：main.js 中引入
      {
        test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 第三方库 (node_modules 中的)
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          enforce: true
        },
        // 项目公共部分代码
        // assets, components, i18n
        common: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]src[\\/]assets|[\\/]src[\\/]components|[\\/]src[\\/]i18n/,
          enforce: true
        }
      }
    }
  },
  plugins: [
    // html plugin
    ...htmlPluginArr,
    // admin html plugin
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: adminTemplatePath,
      chunks: [ 'admin' ]
    }),
    // css 提取成文件
    new MiniCssExtractPlugin({
      filename: `css/[name].css`
    }),
    // 写项目时自动引入 jquery，无需 import
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ]
}
