var config = require('./config');
var port = config.server.port;

module.exports = function (app) {

	app.listen(port, function () {
			console.log('Nitro listening on *:%s', port);
		})
		.on('error', function (err) {
			if (err.errno === 'EADDRINUSE') {
				console.error('Port *:%s already in use.', port);
			}
			else {
				console.error(err);
			}
			process.exit(1);
		});
};
