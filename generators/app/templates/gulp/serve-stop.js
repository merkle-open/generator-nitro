'use strict';

const fs = require('fs');

module.exports = (gulp, plugins) => {
	return (cb) => {
		const pidFile = '.servepid';

		if (fs.existsSync(pidFile)) {
			const pid = fs.readFileSync(pidFile, {
				encoding: 'utf8',
			});
			process.kill(pid);

			fs.unlinkSync(pidFile, (err) => {
				if (err) {
					return console.log(err);
				}
				console.log('file deleted successfully');
			});
		}

		cb();
	};
};
