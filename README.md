# generator-jason
> 用于前后端结合服务器端渲染的前端切图 模块化 + 组件化 工程脚手架

## Installation

First, install [Yeoman](http://yeoman.io) and generator-jason using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-jason
```

Then generate your new project:

```bash
yo jason
```

## 注意

1. 无 babel-polyfill，可自行引入（建议使用 lodash 等工具库代替）
2. 推荐 views 下目录为中文（由于要交由后端，方便找网页）。
3. 建议使用 debug 模块调试（默认已引入，统一使用 app:* 作为开头）

## 组件引入
> 用下面的方式在页面模板中引入组件以及传参

```html
<%= require('../../components/xx/x.ejs')({...}) %>
```

## ejs 图片引入
> 使用下面的方式引入图片

```html
<img src="<%= require('./images/abc.jpg') %>">
<div style="background-image: url(<%= require('./images/abc.jpg') %>)"></div>
```

## 生成的 css 文件说明

### vendor
> 第三方模块 css（node_modules）

### common
> 项目中的通用样式以及组件样式（assets，components）

### hash.css
> 各个页面的单独样式（views/**/index.scss）

## 生成的 js 文件说明

### vendor
> 第三方模块（node_modules）

### common
> 项目中的工具库以及组件（assets，components）

### main
> main.js

### hash.js
> 各页面单独的业务逻辑（views/**/index.js）

