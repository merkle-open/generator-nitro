'use strict';

let config = require('../app/core/config');
const utils = require('./utils');
const globby = require('globby');
const browserSync = utils.getBrowserSyncInstance();

module.exports = (gulp, plugins) => {
	return () => {
		const isDependentStyleSource = (file) => {
			let isDependent = false;
			const cssAssets = utils.getSourcePatterns('css');
			cssAssets.forEach((asset) => {
				globby.sync(asset.deps).forEach((path) => {
					if ( file.replace(/\\/g, '/').endsWith(path) ) {
						isDependent = true;
					}
				});
			});

			return isDependent;
		};
		const clearCache = (e) => {
			if (
				'unlink' === e.event ||
				'add' === e.event ||
				e.path.endsWith('config.json') ||
				isDependentStyleSource(e.path)
			) {
				// forget all
				plugins.cached.caches = {};
				const cssAssets = utils.getSourcePatterns('css');
				cssAssets.forEach((asset) => {
					if (plugins.remember.cacheFor(asset.name)) {
						plugins.remember.forgetAll(asset.name);
					}
				});
				const jsAssets = utils.getSourcePatterns('js');
				jsAssets.forEach((asset) => {
					if (plugins.remember.cacheFor(asset.name)) {
						plugins.remember.forgetAll(asset.name);
					}
				});
			}
		};

		plugins.watch([
			'config.json'
		], (e) => {
			config = utils.reloadConfig();
			clearCache(e);
			utils.updateSourcePatterns();
			gulp.start('compile-css');
			gulp.start('compile-js');
		});

		plugins.watch([
			'assets/css/**/*.<%= options.pre %>',
			'components/**/css/**/*.<%= options.pre %>'
		], (e) => {
			clearCache(e);
			gulp.start('compile-css');
		});

		plugins.watch([
			'assets/js/**/*.js',
			'components/**/js/**/*.js'<% if (options.js === 'TypeScript') { %>,
			'assets/js/**/*.ts',
			'components/**/js/**/*.ts'<% } %><% if (options.clientTpl) { %>,
			'components/**/template/**/*.hbs'<% } %>
		], () => {
			gulp.start('compile-js');
		});

		plugins.watch([
			'views/**/*.' + config.nitro.view_file_extension,
			config.nitro.view_data_directory + '/**/*.json',
			'components/**/*.' + config.nitro.view_file_extension<% if (options.clientTpl) { %>,
			'!components/**/template/**/*.hbs'<% } %>,
			'components/**/_data/*.json'
		], () => {
			browserSync.reload();
		});

		plugins.watch([
			'assets/img/**/*'
		], () => {
			gulp.start('minify-img');
		});

		plugins.watch([
			'assets/font/**/*'
		], () => {
			gulp.start('copy-assets');
		});
	};
};
