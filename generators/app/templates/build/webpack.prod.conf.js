const base = require('./webpack.base.conf');

module.exports = {
  ...base,
  stats: 'errors-only'
};
