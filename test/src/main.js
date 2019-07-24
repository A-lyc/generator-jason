// window.$
import 'jquery';
// import global css
import './assets/styles/global.scss';
// import components
import './components';

/**
 *  开发环境优化 console
 *  注意：
 *    consola 使用了 Object.assign
 *    IE 会报错
 **/
if (process.env.NODE_ENV === 'development') {
  require('consola').wrapAll();
}
