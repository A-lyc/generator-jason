// 网站中的公共样式
import './assets/styles/global.scss';

// 引入 components
let req = require.context('./components', true, /\.js$/i);
req.keys(req).map(req);

