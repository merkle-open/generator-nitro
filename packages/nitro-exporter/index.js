'use strict';

const exportClean = require('./tasks/export-clean.js');
const exportViews = require('./tasks/export-views.js');
const exportProcessing = require('./tasks/export-processing.js');

module.exports = function (gulp, config) {
	const gulpSequence = require('gulp-sequence').use(gulp);
	const shouldExportViews = !config.exporter.length ?
		config.exporter.views :
		config.exporter.some((exporterConfig) => exporterConfig.views === true);

	gulp.task('export-clean', exportClean(config));
	gulp.task('export-views', () => exportViews(gulp, config));
	gulp.task('export-processing', () => exportProcessing(gulp, config));

	if (shouldExportViews) {
		gulp.task('export', gulpSequence(
			'export-clean',
			'assets',
			'dump-views',
			'export-views',
			'export-processing'
		));
	} else {
		gulp.task('export', gulpSequence(
			'export-clean',
			'assets',
			'export-processing'
		));
	}
};
