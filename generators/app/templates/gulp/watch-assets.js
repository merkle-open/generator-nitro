'use strict';

let config = require('../app/core/config');
const utils = require('./utils');
const globby = require('globby');

module.exports = (gulp, plugins) => {

	function isDependentStyleSource(file) {
		let isDependent = false;
		utils.getSourcePatterns('css').forEach((asset) => {
			globby.sync(asset.deps).forEach((path) => {
				if ( file.replace(/\\/g, '/').endsWith(path) ) {
					isDependent = true;
				}
			});
		});
		return isDependent;
	}
	function clearJsCache() {
		utils.getSourcePatterns('js').forEach((asset) => {
			if (plugins.cached.caches && plugins.cached.caches[asset.name]) {
				delete plugins.cached.caches[asset.name];
			}
			if (plugins.remember.cacheFor(asset.name)) {
				plugins.remember.forgetAll(asset.name);
			}
		});
	}
	function clearCssCache() {
		utils.getSourcePatterns('css').forEach((asset) => {
			if (plugins.cached.caches && plugins.cached.caches[asset.name]) {
				delete plugins.cached.caches[asset.name];
			}
			if (plugins.remember.cacheFor(asset.name)) {
				plugins.remember.forgetAll(asset.name);
			}
		});
	}
	function checkCssCache(e) {
		if (
			isDependentStyleSource(e.path) ||
			'unlink' === e.event
		) {
			processChange('cssCache', clearCssCache, 5000);
		}
	}
	function clearCache() {
		processChange('jsCache', clearJsCache, 5000);
		processChange('cssCache', clearCssCache, 5000);
	}

	const lastRun = {};
	function processChange(type, func, throttle) {
		type = type || 'other';
		func = func || function(){};
		throttle = throttle || 1000;

		// call function only once in defined time
		lastRun[type] = lastRun[type] || 0;
		if (new Date() - lastRun[type] > throttle) {
			func();
		}
		lastRun[type] = new Date();
	}

	return () => {
		const browserSync = utils.getBrowserSyncInstance();

		plugins.watch([
			'config.json'
		], () => {
			processChange('config', () => {
				config = utils.reloadConfig();
				clearCache();
				utils.updateSourcePatterns();
				gulp.start('compile-css');
				gulp.start('compile-js');
			}, 6000);
		});

		plugins.watch([
			'assets/css/**/*.<%= options.pre %>',
			'patterns/**/css/**/*.<%= options.pre %>'
		], (e) => {
			processChange('css', () => {
				checkCssCache(e);
				gulp.start('compile-css');
			});
		});

		plugins.watch([
			'assets/js/**/*.js',
			'patterns/**/js/**/*.js'<% if (options.js === 'TypeScript') { %>,
			'assets/js/**/*.ts',
			'patterns/**/js/**/*.ts'<% } %><% if (options.clientTpl) { %>,
			'patterns/**/template/**/*.hbs'<% } %>
		], () => {
			processChange('js', () => {
				gulp.start('compile-js');
			});
		});

		plugins.watch([
			'views/**/*.' + config.nitro.view_file_extension,
			config.nitro.view_data_directory + '/**/*.json',
			'patterns/**/*.' + config.nitro.view_file_extension<% if (options.clientTpl) { %>,
			'!patterns/**/template/**/*.hbs'<% } %>,
			'patterns/**/schema.json',
			'patterns/**/_data/*.json'
		], () => {
			processChange('data', () => {
				browserSync.reload();
			});
		});

		plugins.watch([
			'assets/img/**/*'
		], () => {
			gulp.start('minify-img');
		});

		plugins.watch([
			'patterns/atoms/icon/img/icons/*.svg'
		], () => {
			gulp.start('svg-sprite');
		});

		plugins.watch([
			'assets/font/**/*'
		], () => {
			gulp.start('copy-assets');
		});
	};
};
