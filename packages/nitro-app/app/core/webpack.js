'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('config');
const utils = require('./utils');

const url = utils.getServerBaseUrl();
const webpackConfig = require(process.env.WEBPACK_CONFIG
	? path.join(config.get('nitro.basePath'), process.env.WEBPACK_CONFIG)
	: path.normalize(path.join(config.get('nitro.basePath'), 'config', 'webpack', 'webpack.config.dev')));
webpackConfig.mode = config.get('server.production') ? 'production' : 'development';

const webpackCompiler = webpack(webpackConfig);
const wpm = webpackMiddleware(webpackCompiler);
const wphm = webpackHotMiddleware(webpackCompiler, {
	log: console.log,
	path: '/__webpack_hmr',
	heartbeat: 10 * 1000,
});

module.exports = function (app, hmrApp) {
	app.use(wpm);
	if (hmrApp && config.get('nitro.mode.livereload')) {
		hmrApp.use((req, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', url);
			next();
		});
		hmrApp.use(wphm);
	}
};
