var fs = require('fs');
var utils = require('./utils');

module.exports = function (gulp, plugins) {
	return function (callback) {
		var pidFile = '.servepid';

		if (utils.fileExistsSync(pidFile)) {
			var pid = fs.readFileSync(pidFile, {
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
