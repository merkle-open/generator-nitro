var config = require('../app/core/config');

module.exports = function (gulp, plugins) {
	return function () {
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
			process.exit(result.code);
		});
	};
};
