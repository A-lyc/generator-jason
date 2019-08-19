# generator-jason
> 前端模块化脚手架

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

## 使用场景
1. 后端模板项目
2. 前后端分离但是不依赖 vue，react，angular 等主流库的项目

## 目录解析
```bash
src

  资产目录，css，js，font，image
  - assets
  
  组件目录，由于使用的 ejs 作为 html 语言，可通过 require 的方式引入，实现组件化
  其中 components/index.js 会在 main.js 中执行，初始化组件
  - components
  
  页面目录，存放着页面组件
  - views
  
  全局公共配置
  - main.js
```

## 组件化
> components 和 views 目录下的 A 文件夹作为模板，复制改名用即可 <br/>
> ejs require 实现

```ejs
<!-- ejs 中引入组件 -->
<%= require('../../components/A/index.ejs')({
  // 可传参数
  title: '我是title'
}) %>
```

## 注意

1. views
> 打包时，页面组件的 css 和 js 的名称，进行了单独的处理 <br/>
> 将按照页面组件的目录名编译成 hash 字符串（相同页面的 css 和 js 名称是一样的）<br/>
> 目的是实现页面组件的中文目录命名（后端模板项目建议中文命名，前后端分离项目不建议中文命名）

2. html 路径问题
> 使用下面方法引入即可

```ejs
<img src="<%= require('./images/abc.jpg') %>">
<div style="background-image: url(<%= require('./images/abc.jpg') %>)"></div>
```

## 生成的 css 文件说明

+ vendor
> 第三方模块 css（node_modules）

+ common
> 项目中的通用样式以及组件样式（assets，components）

+ hash.css
> 各个页面的单独样式（views/**/index.scss）

## 生成的 js 文件说明

+ vendor
> 第三方模块（node_modules）

+ common
> 项目中的工具库以及组件（assets，components）

+ main
> main.js

+ hash.js
> 各页面单独的业务逻辑（views/**/index.js）

