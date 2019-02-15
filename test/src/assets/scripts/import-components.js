// 动态引入所有组件 js
let req = require.context('../../components', true, /\.js$/i);
req.keys(req).map(req);
