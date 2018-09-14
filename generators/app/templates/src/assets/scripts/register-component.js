// 自动引入 components 目录下的 js
let req = require.context('../../components', true, /\.js$/i);
req.keys(req).map(req);
