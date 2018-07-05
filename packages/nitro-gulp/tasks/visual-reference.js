'use strict';

/**
 * create new backstopjs references
 */

const backstop = require('backstopjs');
const getPort = require('get-port');
const projectPath = require('../lib/utils').getProjectPath();
const serverPath = require('@nitrooo/app/app/lib/utils').getServerPath();
let isRunning = false;

module.exports = (gulp, plugins) => {
	return () => {
		return getPort()
			.then((port) => {
				const server = plugins.liveServer(serverPath, {
					env: {
						PORT: port,
						NODE_ENV: 'production',
					},
				}, false);

				return server.start()
					.then(() => {}, () => {}, () => {
						if (!isRunning) {
							isRunning = true;
							return backstop('reference', {
								config: require(`${projectPath}tests/backstop/backstop.config.js`)({
									port,
								}),
							})
								.then(() => {
									server.stop();
								}).catch(() => {
									server.stop();
									process.exit(1);
								});
						}
					});
			});
	};
};
