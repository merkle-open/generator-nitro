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
				// allowed extensions for views and additional views
				const extPattern = '{html,json}';
				// check for language configuration
				const langPattern = configEntry.i18n.length
					? `-${configEntry.i18n.filter((lang) => lang !== 'default').join(',')}`
					: '';

				const hasViewArray = Array.isArray(configEntry.views) && configEntry.views.length > 0;
				// views does not have file extensions
				const viewPattern = hasViewArray
					? `{${configEntry.views.filter((view) => !path.extname(view)).join(',')}}`
					: '*';
				// additional views must have a file extension
				const additionalViews = hasViewArray
					? configEntry.views.filter((view) => path.extname(view)).map((view) => path.join(nitroTmpDirectory, view))
					: [];
				// merge dumped views with additional views
				const viewFilter = [
					path.join(nitroTmpDirectory, `${viewPattern}${langPattern}.html`),
					...additionalViews,
				];

				gulp.src(path.join(nitroTmpDirectory, '**', `*.${extPattern}`))
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
