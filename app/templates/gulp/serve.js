module.exports = function (gulp, plugins) {
	return function () {
		var port = process.env.PORT || 8080,
			server = plugins.liveServer(
				'index.js',
				{
					env: {
						PORT: port
					}
				}
			);

		server.start();
	};
};
