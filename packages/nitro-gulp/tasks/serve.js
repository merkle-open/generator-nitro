'use strict';

const config = require('config');
const serverPath = require('@nitro/app/app/lib/utils').getServerPath();

module.exports = (gulp, plugins) => {
	let taskCallbackCalled = false;

	return (cb) => {
		const server = plugins.liveServer(
			serverPath,
			{
				env: {
					PORT: Number(config.get('server.port')),
					NODE_ENV: config.get('server.production') ? 'production' : 'development',
				},
			},
			false
		);
		return server.start().then((result) => {
			console.log('Nitro exited with result:', result);
			process.exit(result.code);

			if (!taskCallbackCalled) {
				taskCallbackCalled = true;
				cb();
			}
		}, () => {

		}, () => {
			if (!taskCallbackCalled) {
				taskCallbackCalled = true;
				cb();
			}
		});
	};
};
