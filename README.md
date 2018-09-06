# generator-jason
> 基于 webpack 的前端多页面模块化脚手架

## 安装
> 需要预先安装好 git

```bash

// 1. 安装 yo
npm install -g yo

// 2. 安装 generator-jason
npm install -g generator-jason

// 3. 进入项目目录后打命令
yo -> jason

```

## 使用
> 页面已文件夹的形式存放于 views 文件夹下 <br/>
> 公共组件已文件夹的形式存放于 comonents 文件夹下 <br/>

## 注意
1. 生成后的 .html/.css/.js 的名称 = views 下对应的目录名，所以尽可能不要用中文
2. 每次新建文件时要重新进入开发环境（暂未解决）

## 启动命令

```bash

// 1. 开发环境
npm run dev

// 2. 打包项目
npm run build

```
