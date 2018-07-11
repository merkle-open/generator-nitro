const options = require('./options');
const webpackConfig = require('@nitro/webpack/webpack-config/webpack.config.dev')(options);

module.exports = webpackConfig;
