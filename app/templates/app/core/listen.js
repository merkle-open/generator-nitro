'use strict';

const config = require('./config');
const port = config.server.port;

module.exports = function (app) {

	app.listen(port, () => {
			console.log('Nitro listening on *:%s', port);
		})
		.on('error', (err) => {
			if (err.errno === 'EADDRINUSE') {
				console.error('Port *:%s already in use.', port);
			}
			else {
				console.error(err);
			}
			process.exit(1);
		});
};
