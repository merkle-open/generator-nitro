'use strict';

const config = require('config');
const fs = require('fs');

module.exports = (gulp, plugins) => {
	let taskCallbackCalled = false;

	return (cb) => {
		const pidFile = '.servepid';
		const server = plugins.liveServer(
			'server.js',
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
			if (fs.existsSync(pidFile)) {
				fs.unlinkSync(pidFile);
			}
			process.exit(result.code);
			if (!taskCallbackCalled) {
				taskCallbackCalled = true;
				cb();
			}
		}, () => {

		}, () => {
			fs.writeFileSync(pidFile, server.server.pid);
			if (!taskCallbackCalled) {
				taskCallbackCalled = true;
				cb();
			}
		});
	};
};
