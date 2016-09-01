var config = require('../app/core/config');
var utils = require('./utils');
var compression = require('compression');

module.exports = function (gulp, plugins) {
	return function () {
		var browserSync = utils.getBrowserSyncInstance();
		browserSync.init({
			proxy: {
				target: 'localhost:' + config.server.port,
				middleware: [compression()]
			},
			port: config.server.proxy
		}, function (e) {
			if (!e) {
				browserSync.notify('Compiling your assets, please wait!');
			}
		});
	};
};
