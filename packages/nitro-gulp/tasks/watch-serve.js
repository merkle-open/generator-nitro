'use strict';

const config = require('config');
const utils = require('../lib/utils');
const compression = require('compression');

module.exports = () => {
	return () => {
		const browserSync = utils.getBrowserSyncInstance();
		// fallback port for older config
		const port = config.has('server.proxy.port') ? config.get('server.proxy.port') : config.get('server.proxy');
		const browserSyncConfig = {
			watch: false,
			proxy: {
				target: `127.0.0.1:${config.get('server.port')}`,
				middleware: [compression()],
			},
			port: Number(port),
			online: !config.get('nitro.mode.offline'),
			ghostMode: false,
		};

		if (config.has('server.proxy.https')) {
			browserSyncConfig.https = config.get('server.proxy.https');
		}
		if (config.has('server.proxy.host')) {
			browserSyncConfig.host = config.get('server.proxy.host');
		}
		if (config.has('server.proxy.open')) {
			browserSyncConfig.open = config.get('server.proxy.open');
		}

		browserSync.init(browserSyncConfig, (e) => {
			if (!e) {
				browserSync.notify('Compiling your assets, please wait!');
			}
		});
	};
};
