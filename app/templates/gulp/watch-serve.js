var browserSync = require('browser-sync');
var compression = require('compression');
var config = require('../app/core/config');

module.exports = function (gulp, plugins) {
	return function () {
		browserSync({
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
