'use strict';

const config = require('../app/core/config');
const fs = require('fs');

module.exports = (gulp, plugins) => {
	let taskCallbackCalled = false;

	return (callback) => {
		const pidFile = '.servepid';
		const server = plugins.liveServer(
			'server.js',
			{
				env: {
					PORT: config.server.port,
					NODE_ENV: config.server.production ? 'production' : 'development'
				}
			},
			false
		);
		return server.start().then((result) => {
			console.log('Nitro exited with result:', result);
			if (fs.existsSync(pidFile)) {
				fs.unlinkSync(pidFile);
			}
			process.exit(result.code);
			if(!taskCallbackCalled) {
				taskCallbackCalled = true;
				callback();
			}
		}, () => {

		}, () => {
			fs.writeFileSync(pidFile, server.server.pid);
			if(!taskCallbackCalled) {
				taskCallbackCalled = true;
				callback();
			}
		});
	};
};
