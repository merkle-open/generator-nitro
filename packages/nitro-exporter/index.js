'use strict';

/* global process */

const exportClean = require('./tasks/export-clean.js');
const exportViews = require('./tasks/export-views.js');
const exportProcessing = require('./tasks/export-processing.js');

function getMergedConfigProps(config) {
	const collectedConfig = {};

	collectedConfig.shouldExportViews = !config.exporter.length ?
		config.exporter.views :
		config.exporter.some((exporterConfig) => exporterConfig.views !== false);

	collectedConfig.languages = !config.exporter.length ?
		config.exporter.i18n :
		config.exporter.reduce((acc, exporterConfig) => [...acc, ...exporterConfig.i18n], ['default']);

	return collectedConfig;
}

module.exports = function (gulp, config) {
	const gulpSequence = require('gulp-sequence').use(gulp);
	const mergedConfig = getMergedConfigProps(config);

	gulp.task('export-clean', exportClean(config));
	gulp.task('export-views', () => exportViews(gulp, config));
	gulp.task('export-processing', () => exportProcessing(gulp, config));

	if (mergedConfig.shouldExportViews) {
		if (mergedConfig.languages.length) {
			// set global env to use in other gulp tasks
			process.env.NITRO_VIEW_LOCALES = mergedConfig.languages.join(',');
		}

		gulp.task('export', gulpSequence(
			'export-clean',
			'dump-views',
			'export-views',
			'export-processing',
		));
	} else {
		gulp.task('export', gulpSequence(
			'export-clean',
			'export-processing'
		));
	}
};
