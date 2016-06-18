var argv = require('yargs').argv;
var config = require('../app/core/config');
var fs = require('fs');

module.exports = function (gulp, plugins) {
	'use strict';

	return function () {
		var pkg = {};
		var bumpType = argv.bump || 'patch';
		var releaseConf = config.exporter.release;
		var releaseMessage;

		var getBumpPromise = function () {
			return new Promise(function (resolve) {
				gulp.src(releaseConf.bumpFiles)
					.pipe(plugins.bump({type: bumpType}))
					.pipe(gulp.dest('./'))
					.on('end', function() {
						pkg = JSON.parse(fs.readFileSync(config.nitro.base_path + 'package.json', {
							encoding: 'utf-8',
							flag: 'r'
						}));
						resolve();
					});
			})
		};

		var getCommitPromise = function () {
			return new Promise(function (resolve) {
				releaseMessage = 'Release ' + pkg.version;

				if(!releaseConf.commit) {
					resolve();
					return;
				}

				gulp.src(releaseConf.bumpFiles)
					.pipe(plugins.git.add())
					.pipe(plugins.git.commit(releaseMessage))
					.on('end', function() {
						resolve();
					});
			});
		};

		var getTagPromise = function () {
			return new Promise(function (resolve) {
				if(!releaseConf.tag) {
					resolve();
					return;
				}
				plugins.git.tag('v' + pkg.version, releaseMessage, function (err) {
					if (err) throw err;
					resolve();
				});
			});
		};

		var getPushPromise = function () {
			return new Promise(function (resolve) {
				if(!releaseConf.push) {
					resolve();
					return;
				}
				plugins.git.push(releaseConf.pushTo, releaseConf.pushBranch, function (err) {
					if (err) throw err;
					plugins.git.push(releaseConf.pushTo, releaseConf.pushBranch, { args: '--tags' }, function (err) {
						if (err) throw err;
						resolve();
					});
				});
			});
		};

		return getBumpPromise()
			.then(getCommitPromise)
			.then(getTagPromise)
			.then(getPushPromise);
	};
};
