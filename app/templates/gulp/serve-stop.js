'use strict';

const fs = require('fs');
const utils = require('./utils');

module.exports = function (gulp, plugins) {
	return function (callback) {
		const pidFile = '.servepid';

		if (utils.fileExistsSync(pidFile)) {
			const pid = fs.readFileSync(pidFile, {
				encoding: 'utf8'
			});
			process.kill(pid);

			fs.unlinkSync(pidFile, function (err) {
				if(err) return console.log(err);
				console.log('file deleted successfully');
			});
		}

		callback();
	};
};
