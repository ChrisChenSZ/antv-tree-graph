const webpackDevConfig = require('./webpack.config.dev.js');
const webpackProdConfig = require('./webpack.config.prod.js');

module.exports = env => {
  console.log(env);
  return env === 'prod' ? webpackProdConfig : webpackDevConfig;
};
