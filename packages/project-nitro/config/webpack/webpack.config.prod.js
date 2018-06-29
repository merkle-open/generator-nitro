const options = require('./options');
const webpackConfig = require('@nitrooo/webpack/webpack-config/webpack.config.prod')(options);

module.exports = webpackConfig;
