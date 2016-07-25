const del = require('del');
const fs = require('fs');
const path = require('path');
const gulpReplace = require('gulp-replace-task');
const gulpZip = require('gulp-zip');

module.exports = function (gulp, config) {
	'use strict';

	return function () {
		const publics = config.exporter.publics;
		const replacements = config.exporter.replacements;
		const renames = config.exporter.renames;

		let getPublicsPromise = function () {
			return Promise.resolve();
		};
		let getReplacementsPromise = function () {
			return Promise.resolve();
		};
		let getRenamesPromise = function () {
			return Promise.resolve();
		};
		let getZipPromise = function () {
			return Promise.resolve();
		};

		if (publics) {
			let src;

			switch (typeof publics) {
				case 'object':
					if (publics.length) {
						src = [];
						publics.forEach((pattern) => {
							if (typeof pattern === 'boolean') {
								src = 'public/**';
								return false;
							}
							if (typeof pattern === 'string') {
								src.push(pattern);
							}
							return true;
						});
					}
					break;
				case 'boolean':
				default:
					src = 'public/**';
					break;
			}
			getPublicsPromise = function () {
				return new Promise((resolve) => gulp.src(src, { base: 'public' })
					.pipe(gulp.dest(config.exporter.dest + path.sep))
					.on('end', () => {
						resolve();
					})
				);
			};
		}

		if (typeof renames === 'object' && renames.length) {
			getRenamesPromise = function () {
				return new Promise((resolve) => {
					let i = 0;

					/**
					 * Will resolve promise, when all renamings are executed.
					 * @returns {null} No return value.
					 */
					function done() {
						if (i === renames.length) {
							resolve();
						}
					}
					renames.forEach((rename) => gulp.src(rename.src, { base: rename.base })
						.pipe(gulp.dest(rename.dest))
						.on('end', () => {
							done(++i);
							del([rename.src]);
						})
					);
				});
			};
		}

		if (typeof replacements === 'object' && replacements.length) {
			getReplacementsPromise = function () {
				return new Promise((resolve) => {
					let i = 0;
					/**
					 * Will resolve promise, when all replacements are executed.
					 * @returns {null} No return value.
					 */
					function done() {
						if (i === replacements.length) {
							resolve();
						}
					}
					replacements.forEach((replacement) => {
						gulp.src(replacement.glob, { base: config.exporter.dest })
							.pipe(gulpReplace({
								patterns: replacement.replace.map(r => ({
									match: new RegExp(r.from, 'g'),
									replacement: r.to
								})),
								preserveOrder: true,
								usePrefix: false
							}))
							.pipe(gulp.dest(config.exporter.dest))
							.on('end', () => {
								done(++i);
							});
					});
				});
			};
		}

		if (config.exporter.zip) {
			getZipPromise = function () {
				return new Promise((resolve) => {
					const pkg = JSON.parse(fs.readFileSync(`${config.nitro.base_path}package.json`, {
						encoding: 'utf-8',
						flag: 'r'
					}));
					gulp.src(`${config.exporter.dest}${path.sep}**`)
						.pipe(gulpZip(`${pkg.name}-${pkg.version}.zip`))
						.pipe(gulp.dest(config.exporter.dest))
						.on('end', () => {
							del(`${config.exporter.dest}${path.sep}!(*.zip)`).then(() => {
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
