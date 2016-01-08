var browserSync = require('browser-sync');
var compression = require('compression');

module.exports = function (gulp, plugins) {
	return function () {
		var port = process.env.PORT || 8080,
			proxy = process.env.PROXY || 8081;

		browserSync({
			proxy: {
				target: 'localhost:' + port,
				middleware: [compression()]
			},
			port: proxy
		}, function (e) {
			if (!e) {
				browserSync.notify('Compiling your assets, please wait!');
			}
		});
	};
};

