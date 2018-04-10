'use strict';

const config = require('config');
const port = config.get('server.port');
const mode = config.get('server.production') ? 'production' : 'development';

module.exports = function (app) {

	app.listen(port, () => {
		console.log('Nitro listening on *:%s in %s mode', port, mode);
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
