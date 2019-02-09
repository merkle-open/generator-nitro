const filter = require('gulp-filter');
const path = require('path');
const utils = require('../lib/utils.js');

module.exports = function (gulp, config) {
	'use strict';

	const nitroTmpDirectory = `${config.get('nitro.tmpDirectory')}/views`;
	const processes = [];

	utils.each(config.exporter, (configEntry) => {
		processes.push(
			new Promise((resolve) => {
				// get array of desired view-name language parts
				const langStrings = configEntry.i18n.length
					?  configEntry.i18n.map((lang) => {
							return (lang !== 'default') ? `-${lang}`: '';
						})
					: [''];
				// array of views are configured?
				const hasViewArray = Array.isArray(configEntry.views) && configEntry.views.length > 0;
				const hasAdditionalRoutesArray = Array.isArray(configEntry.additionalRoutes) && configEntry.additionalRoutes.length > 0;
				// views does not have file extensions
				const viewPattern = hasViewArray
					? `{${configEntry.views.join(',')},fantasyNameQWedRayFiZtFlkXd}`
					: '*';
				// additional views
				const additionalViews =hasAdditionalRoutesArray
					? configEntry.additionalRoutes.map((view) => path.join(nitroTmpDirectory, view))
					: [];

				// merge dumped views with additional views
				const viewFilter = [
					...langStrings.map((lang) => path.join(nitroTmpDirectory, `${viewPattern}${lang}.html`)),
					...additionalViews,
				];

				gulp.src(path.join(nitroTmpDirectory, '**', `*.*`))
					.pipe(filter(viewFilter))
					.pipe(gulp.dest(configEntry.dest))
					.on('end', () => {
						resolve();
					});
			})
		);
	});

	return new Promise((resolve) => {
		Promise.all(processes).then(() => {
			resolve();
		});
	});
};
