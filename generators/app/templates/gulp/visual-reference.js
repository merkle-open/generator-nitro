'use strict';

/**
 * create new backstopjs references
 */

const backstop = require('backstopjs');
const getPort = require('get-port');
let isRunning = false;

module.exports = (gulp, plugins) => {
	return () => {
		return getPort()
			.then((port) => {
				const server = plugins.liveServer('server', {
					env: {
						PORT: port,
					},
				}, false);

				return server.start()
					.then(() => {}, () => {}, () => {
						if (!isRunning) {
							isRunning = true;
							return backstop('reference', {
								config: require('../tests/backstop/backstop.config.js')({
									port: port
								})
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
