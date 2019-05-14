'use strict';

const gulp = require('gulp');
const getTask = require('@nitro/gulp/lib/utils').getTask;<% if (options.exporter) { %>
const config = require('config');
require('@nitro/exporter')(gulp, config);<% } %>

gulp.task('copy-assets', getTask('copy-assets'));
gulp.task('minify-images', getTask('minify-images'));
gulp.task('svg-sprites', getTask('svg-sprites'));
gulp.task('assets', ['copy-assets', 'minify-images', 'svg-sprites']);
gulp.task('watch-assets', ['assets'], getTask('watch-assets'));
gulp.task('watch-serve', getTask('watch-serve'));
gulp.task('develop', ['watch-assets', 'watch-serve']);
gulp.task('dump-views', getTask('dump-views'));
gulp.task('lint-accessibility', ['dump-views'], getTask('lint-accessibility'));
gulp.task('lint-html', ['dump-views'], getTask('lint-html'));
