var config = require('../app/core/config');
var fs = require('fs');

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
		server.start().then(function (result) {
			console.log('Server exited with result:', result);
			fs.unlinkSync(pidFile);
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
