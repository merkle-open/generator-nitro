const options = require('./options');
const webpackConfig = require('@nitrooo/webpack/webpack-config/webpack.config.dev')(options);

module.exports = webpackConfig;
