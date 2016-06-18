var config = require('../app/core/config');
var del = require('del');
var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;

module.exports = function (gulp, plugins) {
	'use strict';

	return function () {
		var publics = config.exporter.publics;
		var replacements = config.exporter.replacements;
		var renames = config.exporter.renames;

		var getPublicsPromise = function () {
			return Promise.resolve();
		};
		var getReplacementsPromise = function () {
			return Promise.resolve();
		};
		var getRenamesPromise = function () {
			return Promise.resolve();
		};
		var getZipPromise = function() {
			return Promise.resolve();
		};

		if(publics) {
			var src;

			switch(typeof publics) {
				case 'object':
					if(publics.length) {
						src = [];
						publics.forEach(function (pattern) {
							if(typeof pattern === 'boolean') {
								src = 'public/**';
								return false;
							}
							if(typeof pattern === 'string') {
								src.push(pattern);
							}
						});
					}
					break;
				case 'boolean':
				default:
					src = 'public/**';
					break;
			}
			getPublicsPromise = function () {
				return new Promise(function (resolve) {
					gulp.src(src, { base: 'public' })
						.pipe(gulp.dest(config.exporter.dest + path.sep))
						.on('end', function () {
							resolve();
						});
				});
			};
		}

		if(typeof renames === 'object' && renames.length) {
			getRenamesPromise = function () {
				return new Promise(function (resolve) {
					var i = 0;
					function done() {
						if(i === renames.length) {
							resolve();
						}
					}
					renames.forEach(function (rename) {
						gulp.src(rename.src, { base: rename.base })
							.pipe(gulp.dest(rename.dest))
							.on('end', function () {
								done(++i);
								del([rename.src]);
							});
					});
				});
			};
		}

		if(typeof replacements === 'object' && replacements.length) {
			getReplacementsPromise = function () {
				return new Promise(function (resolve) {
					var i = 0;
					function done() {
						if(i === replacements.length) {
							resolve();
						}
					}
					replacements.forEach(function (replacement) {
						var str = gulp.src(replacement.glob, { base: config.exporter.dest });

						replacement.replace.forEach(function (r) {
							str.pipe(plugins.replace(r.from, r.to));
						});

						str.pipe(gulp.dest(config.exporter.dest));

						str.on('end', function () {
							done(++i);
						});
					});
				});
			};
		}

		if(config.exporter.zip) {
			getZipPromise = function() {
				return new Promise(function (resolve) {
					var pkg = JSON.parse(fs.readFileSync(config.nitro.base_path + 'package.json', {
						encoding: 'utf-8',
						flag: 'r'
					}));
					gulp.src(config.exporter.dest + path.sep + '**')
						.pipe(plugins.zip(pkg.name + '-' + pkg.version + '.zip'))
						.pipe(gulp.dest(config.exporter.dest))
						.on('end', function() {
							del(config.exporter.dest + path.sep + '!(*.zip)').then(function () {
								resolve();
							});
						});
				});
			};
		}

		return getPublicsPromise()
			.then(getRenamesPromise)
			.then(getReplacementsPromise)
			.then(getZipPromise);
	};
};
