var cfg = require('../app/core/config');
var utils = require('./utils');
var browserSync = utils.getBrowserSyncInstance();

module.exports = function (gulp, plugins) {
	return function () {
		var clearCache = function (e) {
			if (
				'unlink' === e.event ||
				'add' === e.event ||
				e.path.endsWith('config.json')
			) {
				// forget all
				plugins.cached.caches = {};
				var assets = utils.getSourceFiles('.css');
				assets.forEach(function (asset) {
					if (plugins.remember.cacheFor(asset.name)) {
						plugins.remember.forgetAll(asset.name);
					}
				});
			}
		};

		plugins.watch([
			'config.json'
		], function (e) {
			cfg = utils.reloadConfig();
			clearCache(e);
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
		], function () {
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
