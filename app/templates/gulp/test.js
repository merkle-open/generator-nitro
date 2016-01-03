var Karma = require('karma').Server;
var path = require('path');

module.exports = function (gulp, plugins) {
	return function (done) {
		new Karma({
			configFile: path.join(__dirname, '..', 'karma.conf.js'),
			singleRun:  true,
			autoWatch:  false
		}, done).start();
	};
};

