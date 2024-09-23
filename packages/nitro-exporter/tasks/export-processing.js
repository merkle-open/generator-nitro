'use strict';

const del = require('del');
const deleteEmpty = require('delete-empty');
const fs = require('fs');
const globParent = require('glob-parent');
const { globSync } = require('glob');
const gulpZip = require('gulp-vinyl-zip').zip;
const htmlmin = require('gulp-html-minifier-terser');
const path = require('path');
const unique = require('array-unique');

const utils = require('../lib/utils.js');

module.exports = function (gulp, config) {
	'use strict';

	const processes = [];

	utils.each(config.exporter, (configEntry) => {
		processes.push(
			new Promise((resolveConfigEntry) => {
				const publics = configEntry.publics;
				const replacements = configEntry.replacements;
				const renames = configEntry.renames;

				let getPublicsPromise = function () {
					return Promise.resolve();
				};
				let getReplacementsPromise = function () {
					return Promise.resolve();
				};
				let getRenamesPromise = function () {
					return Promise.resolve();
				};
				const getCleanupPromise = function () {
					return deleteEmpty(path.resolve(configEntry.dest));
				};
				let getMinifyPromise = () => {
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
										if (fs.existsSync(globParent(pattern))) {
											src.push(pattern);
										}
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
						return new Promise((resolve) =>
							gulp
								.src(src, { base: 'public', allowEmpty: true })
								.pipe(gulp.dest(configEntry.dest + path.sep))
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
							/**
							 * Will move files.
							 * @returns {null} No return value.
							 */
							function move() {
								gulp.src(renames[i].src, { base: renames[i].base, allowEmpty: true })
									.pipe(gulp.dest(renames[i].dest))
									.on('end', () => {
										del.sync(renames[i++].src);
										if (i < renames.length) {
											move();
										} else {
											done();
										}
									});
							}
							move();
						});
					};
				}

				if (typeof replacements === 'object' && replacements.length) {
					getReplacementsPromise = function () {
						return new Promise((resolve) => {
							replacements.forEach((replacement) => {
								let files = [];
								replacement.glob.forEach((g) => {
									files = files.concat(globSync(g));
								});
								unique(files);
								files.forEach((f) => {
									let content = fs.readFileSync(f, 'utf8');

									replacement.replace.forEach((r) => {
										content = content.replace(new RegExp(r.from, 'g'), r.to);
									});

									fs.writeFileSync(f, content);
								});
							});

							resolve();
						});
					};
				}

				if (configEntry.minifyHtml) {
					getMinifyPromise = function () {
						return new Promise((resolve) =>
							gulp
								.src(`${configEntry.dest}/**/*.html`)
								.pipe(htmlmin({
									collapseWhitespace: true,
									minifyCSS: true,
									minifyJS: true,
								}))
								.pipe(gulp.dest(configEntry.dest))
								.on('end', () => {
									resolve();
								})
						);
					};
				}

				if (configEntry.zip) {
					getZipPromise = function () {
						return new Promise((resolve) => {
							const pkg = JSON.parse(
								fs.readFileSync(`${config.nitro.basePath}package.json`, {
									encoding: 'utf-8',
									flag: 'r',
								})
							);
							gulp.src(`${configEntry.dest}/**/*`)
								.pipe(gulpZip(`${pkg.name}-${pkg.version}.zip`))
								.pipe(gulp.dest(configEntry.dest))
								.on('end', () => {
									del(`${configEntry.dest}${path.sep}!(*.zip)`).then(() => {
										resolve();
									});
								});
						});
					};
				}

				getPublicsPromise()
					.then(getRenamesPromise)
					.then(getReplacementsPromise)
					.then(getCleanupPromise)
					.then(getMinifyPromise)
					.then(getZipPromise)
					.then(() => {
						resolveConfigEntry();
					});
			})
		);
	});

	return Promise.all(processes);
};
