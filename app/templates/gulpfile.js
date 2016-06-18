var gulp = require('gulp');
var getTask = require('./gulp/utils').getTask;<% if (options.exporter) { %>
var gulpSequence = require('gulp-sequence');<% } %>

gulp.task('install-githooks', getTask('install-githooks'));
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
gulp.task('build', ['clean-assets'], getTask('build'));<% if (options.exporter) { %>
gulp.task('export-clean', getTask('export-clean'));
gulp.task('export-views', ['serve'], getTask('export-views'));
gulp.task('export-processing', getTask('export-processing'));
gulp.task('export', gulpSequence(['export-clean', 'assets'], 'export-views', 'export-processing'));
gulp.task('release', getTask('release'));<% } %>
gulp.task('production', ['assets'], getTask('production'));
