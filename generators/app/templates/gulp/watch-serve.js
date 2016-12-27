'use strict';

const config = require('../app/core/config');
const utils = require('./utils');
const compression = require('compression');

module.exports = (gulp, plugins) => {
	return () => {
		const browserSync = utils.getBrowserSyncInstance();
		browserSync.init({
			proxy: {
				target: 'localhost:' + config.server.port,
				middleware: [compression()]
			},
			port: config.server.proxy
		}, (e) => {
			if (!e) {
				browserSync.notify('Compiling your assets, please wait!');
			}
		});
	};
};
