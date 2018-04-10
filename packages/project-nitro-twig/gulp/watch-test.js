'use strict';

const Karma = require('karma').Server;
const path = require('path');

module.exports = (gulp, plugins) => {
	return (done) => {
		new Karma({
			configFile: path.join(__dirname, '..', 'karma.conf.js'),
			browsers: ['Chrome'],
			autoWatch: true,
			singleRun: false,
		}, done).start();
	};
};
