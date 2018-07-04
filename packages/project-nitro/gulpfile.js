'use strict';

const gulp = require('gulp');
const getTask = require('@nitrooo/gulp/utils/utils').getTask;
const gulpSequence = require('gulp-sequence').use(gulp);
const config = require('config');
require('@nitrooo/exporter')(gulp, config);

gulp.task('copy-assets', getTask('copy-assets'));
gulp.task('minify-images', getTask('minify-images'));
gulp.task('svg-sprites', getTask('svg-sprites'));
gulp.task('assets', ['copy-assets', 'minify-images', 'svg-sprites']);
gulp.task('watch-assets', ['assets'], getTask('watch-assets'));
gulp.task('serve', getTask('serve'));
gulp.task('watch-serve', ['serve'], getTask('watch-serve'));
gulp.task('develop', ['watch-assets', 'watch-serve']);
gulp.task('production', gulpSequence('assets', 'serve'));
gulp.task('dump-views', getTask('dump-views'));
gulp.task('lint-accessibility', ['dump-views'], getTask('lint-accessibility'));
gulp.task('lint-html', ['dump-views'], getTask('lint-html'));
gulp.task('visual-approve', getTask('visual-approve'));
gulp.task('visual-reference', ['assets'], getTask('visual-reference'));
gulp.task('visual-test', ['assets'], getTask('visual-test'));
