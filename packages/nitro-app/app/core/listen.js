'use strict';

const config = require('config');
const mode = config.get('server.production') ? 'production' : 'development';
const port = config.get('server.port');

/* eslint-disable no-console */
module.exports = function (app) {

	app.listen(port, () => {
			console.log('---------------------------------------------');
			console.log('Nitro listening on *:%s in %s mode', port, mode);
			console.log('---------------------------------------------');
		})
			.on('error', (err) => {
				if (err.errno === 'EADDRINUSE') {
					console.error('Port *:%s already in use.', port);
				} else {
					console.error(err);
				}
				process.exit(1);
			});
};
/* eslint-enable no-console */
