import './index.scss'

// 页面名数组
let htmlNameArr = require
  .context('../src/views', true, /\.ejs$/)
  .keys()
  .map(path => {
    return path
    // 统一正反斜杠
      .replace(/\\/g, '/')
      // 去除开头
      .replace('./', '')
      // 去除结尾
      .replace('/index.ejs', '') + '.html'
  })

// 组件 render 数组
let compContexts = require.context('../src/components', true, /\.ejs$/)
let compRenderArr = compContexts
  .keys()
  .map(comp => {
    return compContexts(comp)
  })

// 拼接 html
let linkHtml = (function () {
  let html = ''
  htmlNameArr.forEach(htmlName => {
    html += `<a href="${ './' + htmlName }">${ htmlName }</a>`
  })
  return html
})()
let compHtml = (function () {
  let html = ''
  compRenderArr.forEach(render => {
    html += `
      <div class="component-group">
        ${ render() }
      </div>
    `
  })
  return html
})()

// 放入页面
$('.link').html(linkHtml)
$('.component').html(compHtml)
