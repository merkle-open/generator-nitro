const cwd = process.cwd();
const filter = require('gulp-filter');
const path = require('path');

const utils = require('../lib/utils.js');

const nitroGulpUtils = require(path.resolve(cwd, 'gulp', 'utils'));
const nitroTmpDirectory = nitroGulpUtils.getTmpDirectory('views');

module.exports = function (gulp, config) {
	'use strict';

	const processes = [];

	utils.each(config.exporter, (configEntry) => {
		processes.push(
			new Promise((resolve) => {
				const i18nFilter = configEntry.i18n.length ?
					configEntry.i18n.map((lng) => path.join(nitroTmpDirectory, `*-${lng}.html`)) :
					path.join(nitroTmpDirectory, '*.html');
				if (configEntry.views === true) {
					gulp.src(path.join(nitroTmpDirectory, '*.html'))
						.pipe(filter(i18nFilter))
						.pipe(gulp.dest(configEntry.dest))
						.on('end', () => {
							resolve();
						});
				} else if (typeof configEntry.views === 'object' && configEntry.views.length > 0) {
					gulp.src(path.join(nitroTmpDirectory, '*.html'))
						.pipe(filter(configEntry.views.map((v) => path.join(nitroTmpDirectory, `${v}.html`))))
						.pipe(filter(i18nFilter))
						.pipe(gulp.dest(configEntry.dest))
						.on('end', () => {
							resolve();
						});
				}
			})
		);
	});

	return new Promise((resolve) => {
		Promise.all(processes).then(() => {
			resolve();
		});
	});
};
