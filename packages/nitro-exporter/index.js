const gulpSequence = require('gulp-sequence');
const exportClean = require('./tasks/export-clean.js');
const exportViews = require('./tasks/export-views.js');
const exportProcessing = require('./tasks/export-processing.js');

module.exports = function (gulp, config) {
	gulp.task('export-clean', exportClean(config));
	gulp.task('export-views', () => exportViews(gulp, config));
	gulp.task('export-processing', () => exportProcessing(gulp, config));
	gulp.task('export', gulpSequence(
		'export-clean',
		'assets',
		'serve',
		'export-views',
		'export-processing',
		'serve-stop'
	));
};
