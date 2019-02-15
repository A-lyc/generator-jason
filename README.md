# generator-jason
> 用于服务器端渲染的前端切图模块化脚手架

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
> 没有设置 babel-polyfill，可自行引入

## 生成的 css 文件说明

### vendor
> 第三方模块 css

### common
> 项目中的通用样式以及组件样式（assets，components）

### hash.css
> 各个页面的单独样式

## 生成的 js 文件说明

### vendor
> 第三方模块

### common
> 项目中的工具库以及组件（assets，components）

### main
> main.js

### hash.js
> 各页面单独的业务逻辑

