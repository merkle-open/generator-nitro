var config = require('../app/core/config');
var fs = require('fs');

module.exports = function (gulp, plugins) {
	return function (callback) {
		var server = plugins.liveServer(
			'server.js',
			{
				env: {
					PORT: config.server.port
				}
			},
			false
		);
		server.start().then(function (result) {
			console.log('Server exited with result:', result);
			fs.unlinkSync('.servepid');
			process.exit(result.code);
			callback();
		}, function () {

		}, function() {
			fs.writeFileSync('.servepid', server.server.pid);
			callback();
		});
	};
};
