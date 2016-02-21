module.exports = function (gulp, plugins) {
	return function () {
		var port = process.env.PORT || 8080,
			server = plugins.liveServer(
				'server.js',
				{
					env: {
						PORT: port
					}
				},
				false
			);

		server.start();
	};
};
