'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('config');
const webpackConfig = require(process.env.WEBPACK_CONFIG
	? path.join(config.get('nitro.basePath'), process.env.WEBPACK_CONFIG)
	: path.normalize(path.join(config.get('nitro.basePath'), 'config', 'webpack', 'webpack.config.dev')));
webpackConfig.mode = config.get('server.production') ? 'production' : 'development';
const watchOptions = webpackConfig.watchOptions || {
	ignored: [
		'**/*.hbs',
		'!**/template/**/*.hbs',
		'**/*.json',
		'**/*.md',
		'**/*.png',
		'**/*.svg',
		'**/node_modules/**',
	],
};
const webpackCompiler = webpack(webpackConfig);
const wpm = webpackMiddleware(webpackCompiler, {
	logLevel: 'warn',
	publicPath: webpackConfig.output.publicPath,
	stats: 'minimal',
	watchOptions,
});
const wphm = webpackHotMiddleware(webpackCompiler, {
	log: console.log,
	path: '/__webpack_hmr',
	heartbeat: 10 * 1000,
});

module.exports = function (app) {
	app.use(wpm);
	if (config.get('nitro.mode.livereload')) {
		app.use(wphm);
	}
};
