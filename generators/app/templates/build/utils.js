'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 *  查询出一个目录下的所有文件的文件名（存入到一维数组）
 *  若目录下还有目录则会递归调用（存入到二维数组）
 *
 *  @param { String } path 文件夹路径
 *
 *  @return { Array } 目录下的所有文件（可能多维）多维数组有 .dirName 属性为目录名称
 **/
function readAllFiles (path) {
  let filesName = fs.readdirSync(path);
  // 遍历 filesName 判断路径是否为目录
  // 若为目录则继续找子文件夹
  _.each(filesName, (fileName, i) => {
    let fullPath = path + '/' + fileName;
    let stats = fs.statSync(fullPath);
    // 若为数组则递归调用，并将目录名字替换为二维数组
    if (stats.isDirectory()) {
      filesName[ i ] = readAllFiles(fullPath);
      filesName[ i ].dirName = fileName;
    }
  });
  return filesName;
}
exports.readAllFiles = readAllFiles;
