const gulpSequence = require('gulp-sequence');
const exportClean = require('./tasks/export-clean.js');
const exportViews = require('./tasks/export-views.js');
const exportProcessing = require('./tasks/export-processing.js');

module.exports = function (gulp, config) {
	const shouldExportViews = !config.exporter.length ? config.exporter.views :
		config.exporter.some((exporterConfig) => exporterConfig.views === true);

	gulp.task('export-clean', exportClean(config));
	gulp.task('export-views', () => exportViews(gulp, config));
	gulp.task('export-processing', () => exportProcessing(gulp, config));
	gulp.task('export', gulpSequence(
		'export-clean',
		'assets',
		shouldExportViews ? 'serve' : '',
		shouldExportViews ? 'export-views' : '',
		shouldExportViews ? 'serve-stop' : '',
		'export-processing'
	));
};
