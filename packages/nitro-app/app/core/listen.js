'use strict';

const config = require('config');
const mode = config.get('server.production') ? 'production' : 'development';
const port = config.get('server.port');

/* eslint-disable no-console */
module.exports = function (app, opts = {}) {
	const rawHost = (config.has('server.host')) ? config.get('server.host') : 'localhost';
	const host = ['0.0.0.0', '::', '::0'].includes(String(rawHost)) ? 'localhost' : rawHost;
	const url = `http://${host}:${port}`;
	const openBrowser = opts.open; // true | false | string (URL)

	const server = app
		.listen(port, () => {
			console.log('-------------------------------------------------------------------');
			console.log('Nitro listening on %s in %s mode', url, mode);
			console.log('-------------------------------------------------------------------');

			if (openBrowser) {
				const openUrl = typeof openBrowser === 'string' ? openBrowser : url;
				(async () => {
					try {
						const mod = await import('open');
						const open = mod.default;
						await open(openUrl, { wait: false });
					} catch (e) { /* empty */}
				})();
			}
		})
		.on('error', (err) => {
			if (err && err.errno === 'EADDRINUSE') {
				console.error('Port *:%s already in use.', port);
			} else {
				console.error(err);
			}
			process.exit(1);
		});

	return server;
};
/* eslint-enable no-console */
