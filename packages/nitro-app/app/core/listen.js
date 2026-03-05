'use strict';

const config = require('config');
const utils = require('./utils');

const mode = config.get('server.production') ? 'production' : 'development';
const port = config.get('server.port');
const hmrPort = config.get('server.hmrPort');

/* eslint-disable no-console */
module.exports = function (app, hmrApp, opts = {}) {
	const url = utils.getServerBaseUrl(port);
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

	if (hmrApp && mode === 'development') {
		hmrApp
			.listen(hmrPort)
			.on('error', (err) => {
				if (err && err.errno === 'EADDRINUSE') {
					console.error('Proxy Port *:%s already in use.', hmrPort);
				} else {
					console.error(err);
				}
				process.exit(1);
			});
	}

	return server;
};
/* eslint-enable no-console */
