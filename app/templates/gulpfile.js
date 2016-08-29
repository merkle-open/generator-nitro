'use strict';

const gulp = require('gulp');
const getTask = require('./gulp/utils').getTask;<% if (options.exporter || options.release) { %>
const config = require('./app/core/config');<% } %><% if (options.exporter) { %>
require('nitro-exporter')(gulp, config);<% } %><% if (options.release) { %>
require('nitro-release')(gulp, config);<% } %>

gulp.task('sync-githooks', getTask('sync-githooks'));
gulp.task('compile-css', getTask('compile-css'));<% if (options.js === 'TypeScript') { %>
gulp.task('compile-ts', getTask('compile-ts'));<% } %><% if (options.clientTpl) { %>
gulp.task('compile-templates', getTask('compile-templates'));<% } %>
gulp.task('compile-js', <% if (options.js === 'TypeScript') { %>['compile-ts'<% if (options.clientTpl) { %>, 'compile-templates'<% } %>], <% } else if (options.clientTpl) { %>['compile-templates'], <% } %>getTask('compile-js'));
gulp.task('minify-css', ['compile-css'], getTask('minify-css'));
gulp.task('minify-js', ['compile-js'], getTask('minify-js'));
gulp.task('minify-img', getTask('minify-img'));
gulp.task('copy-assets', getTask('copy-assets'));
gulp.task('clean-assets', getTask('clean-assets'));
gulp.task('assets', ['copy-assets', 'minify-img', 'minify-js', 'minify-css']);
gulp.task('watch-assets', ['assets'], getTask('watch-assets'));
gulp.task('serve', getTask('serve'));
gulp.task('watch-serve', ['serve'], getTask('watch-serve'));
gulp.task('test', ['compile-css', 'compile-js'], getTask('test'));
gulp.task('develop', ['watch-assets', 'watch-serve']);
gulp.task('build', ['clean-assets'], getTask('build'));
gulp.task('production', ['assets'], getTask('production'));
