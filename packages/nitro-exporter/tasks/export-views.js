const cwd = process.cwd();
const filter = require('gulp-filter');
const path = require('path');
const utils = require('../lib/utils.js');

module.exports = function (gulp, config) {
	'use strict';

	let nitroTmpDirectory = '';
	if (config.has('nitro.tmpDirectory')) {
		nitroTmpDirectory = `${config.get('nitro.tmpDirectory')}/views`;
	} else {
		const nitroGulpUtils = require(path.resolve(cwd, 'gulp', 'utils'));
		nitroTmpDirectory = nitroGulpUtils.getTmpDirectory('views');
	}

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
				} else if (Array.isArray(configEntry.views) && configEntry.views.length > 0) {
					gulp.src(path.join(nitroTmpDirectory, '*.html'))
						.pipe(filter(configEntry.views.map((v) => path.join(nitroTmpDirectory, `${v}.html`))))
						.pipe(filter(i18nFilter))
						.pipe(gulp.dest(configEntry.dest))
						.on('end', () => {
							resolve();
						});
				} else {
					resolve();
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
