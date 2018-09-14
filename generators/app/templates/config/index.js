module.exports = {
  // 是否引入 babel-polyfill
  babelPolyfill: false,
  // html 压缩
  htmlMinify: false,
  // 是否将所有的文件都赋值 hash 名
  hash: false,
  // 是否将 css 提取到 css 文件
  extractCss: true,
  // 需要挂到 window 下的模块
  // key 为 window 属性名
  // value 为 模块名
  window: {
    $: 'jquery',
    jQuery: 'jquery'
  }
};
