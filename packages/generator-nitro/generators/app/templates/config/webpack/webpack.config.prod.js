const options = require('./options');
const webpackConfig = require('@nitro/webpack/webpack-config/webpack.config.prod')(options);

module.exports = webpackConfig;
