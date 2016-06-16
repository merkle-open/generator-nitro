var config = require('../app/core/config.js');
var path = require('path');
var Promise = require('es6-promise').Promise;
var replace = require('gulp-replace');
var es = require('event-stream');
var del = require('del');

module.exports = function (gulp) {
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
							str.pipe(replace(r.from, r.to));
						});

						str.pipe(gulp.dest(config.exporter.dest));

						str.on('end', function () {
							done(++i);
						});
					});
				});
			};
		}

		return getPublicsPromise()
			.then(getRenamesPromise)
			.then(getReplacementsPromise)
	};
};
