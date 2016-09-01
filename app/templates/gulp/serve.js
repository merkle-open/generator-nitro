var config = require('../app/core/config');
var fs = require('fs');
var utils = require('./utils');

module.exports = function (gulp, plugins) {
	var taskCallbackCalled = false;

	return function (callback) {
		var pidFile = '.servepid';
		var server = plugins.liveServer(
			'server.js',
			{
				env: {
					PORT: config.server.port,
					NODE_ENV: config.server.production ? 'production' : 'development'
				}
			},
			false
		);
		return server.start().then(function (result) {
			console.log('Server exited with result:', result);
			if (utils.fileExistsSync(pidFile)) {
				fs.unlinkSync(pidFile);
			}
			process.exit(result.code);
			if(!taskCallbackCalled) {
				taskCallbackCalled = true;
				callback();
			}
		}, function () {

		}, function() {
			fs.writeFileSync(pidFile, server.server.pid);
			if(!taskCallbackCalled) {
				taskCallbackCalled = true;
				callback();
			}
		});
	};
};
