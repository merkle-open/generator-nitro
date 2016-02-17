var browserSync = require('browser-sync');
var cfg = require('../app/core/config');

module.exports = function (gulp, plugins) {
	return function () {
		var clearCache = function (e) {
			if ('delete' === e.type) {
				delete plugins.cached.caches.scripts[e.path];
				plugins.remember.forget('scripts', e.path);
			}
		};

		plugins.watch([
			'config.json'
		], function () {
			cfg = cfg.reload();
			gulp.start('compile-css');
			gulp.start('compile-js');
		});

		plugins.watch([
			'assets/css/**/*.<%= options.pre %>',
			'components/**/css/**/*.<%= options.pre %>'
		], function (e) {
			clearCache(e);
			gulp.start('compile-css');
		});

		plugins.watch([
			'assets/js/**/*.js',
			'components/**/js/**/*.js'<% if (options.js === 'TypeScript') { %>,
			'assets/js/**/*.ts',
			'components/**/js/**/*.ts'<% } %><% if (options.clientTpl) { %>,
			'components/**/template/**/*.hbs'<% } %>
		], function () {<% if (options.js === 'TypeScript') { %>
			clearCache(e);<% } %>
			gulp.start('compile-js');
		});

		plugins.watch([
			'views/**/*.' + cfg.nitro.view_file_extension,
			'!' + cfg.nitro.view_partials_directory + '/*.' + cfg.nitro.view_file_extension, // exclude partials
			'views/_data/**/*.json',
			'components/**/*.' + cfg.nitro.view_file_extension<% if (options.clientTpl) { %>,
			'!components/**/template/**/*.hbs'<% } %>,
			'components/**/_data/*.json'
		], function () {
			browserSync.reload();
		});

		plugins.watch([
			'assets/img/**/*'
		], function () {
			gulp.start('minify-img');
		});

		plugins.watch([
			'assets/font/**/*'
		], function () {
			gulp.start('copy-assets');
		});
	};
};
