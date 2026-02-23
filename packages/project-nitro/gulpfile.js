'use strict';

const gulp = require('gulp');
const getTask = require('@nitro/gulp/lib/utils').getTask;
const config = require('config');

gulp.task('copy-assets', getTask('copy-assets'));
gulp.task('minify-images', getTask('minify-images'));
gulp.task('svg-sprites', getTask('svg-sprites'));
gulp.task('assets', gulp.parallel('copy-assets', 'minify-images', 'svg-sprites'));
gulp.task('watch-assets', gulp.series(['assets'], getTask('watch-assets')));
gulp.task('develop', gulp.series('watch-assets'));
gulp.task('dump-views', getTask('dump-views'));
gulp.task('lint-html', gulp.series(['dump-views'], getTask('lint-html')));

require('@nitro/exporter')(gulp, config);
