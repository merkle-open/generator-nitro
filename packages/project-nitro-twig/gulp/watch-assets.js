'use strict';

const config = require('config');
const utils = require('./utils');
const globby = require('globby');

module.exports = (gulp, plugins) => {

	const throttleBase = config.get('nitro.watch.throttle.base');
	const throttleCache = config.get('nitro.watch.throttle.cache');
	const lastRun = {};

	function isDependentStyleSource(file) {
		let isDependent = false;
		utils.getSourcePatterns('css').forEach((asset) => {
			globby.sync(asset.deps).forEach((path) => {
				if (file.replace(/\\/g, '/').endsWith(path)) {
					isDependent = true;
				}
			});
		});
		return isDependent;
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
			e.event === 'unlink'
		) {
			processChange('cssCache', clearCssCache, throttleCache);
		}
	}
	function processChange(type, func, throttle) {
		type = type || 'other';
		func = func || function () {};
		throttle = throttle || throttleBase;

		// call function only once in defined time
		lastRun[type] = lastRun[type] || 0;
		if (new Date() - lastRun[type] > throttle) {
			func();
		}
		lastRun[type] = new Date();
	}

	return () => {
		const browserSync = utils.getBrowserSyncInstance();

		// styles
		plugins.watch([
			'src/assets/css/**/*.scss',
			'src/patterns/**/css/**/*.scss',
		], (e) => {
			processChange('css', () => {
				checkCssCache(e);
				gulp.start('compile-css');
			});
		});

		// js
		plugins.watch([
			'src/assets/js/**/*.js',
			'src/patterns/**/js/**/*.js',
			'src/patterns/**/template/**/*.hbs',
		], () => {
			processChange('js', () => {
				gulp.start('compile-js');
			});
		});

		// proto css
		plugins.watch([
			'src/proto/css/*.scss',
			'src/patterns/**/proto/**/*.scss'
		], () => {
			processChange('css.prototype', function() {
				gulp.start('compile-css-proto');
			});
		});

		// proto js
		plugins.watch([
			'src/proto/js/*.js',
			'src/patterns/**/proto/**/*.js'
		], () => {
			processChange('js.prototype', function() {
				gulp.start('compile-js-proto');
			});
		});

		// views & data
		plugins.watch([
			`src/views/**/*.${config.get('nitro.viewFileExtension')}`,
			`${config.get('nitro.viewDataDirectory')}/**/*.json`,
			`src/patterns/**/*.${config.get('nitro.viewFileExtension')}`,
			'!src/patterns/**/template/**/*.hbs',
			'src/patterns/**/schema.json',
			'src/patterns/**/_data/*.json',
		], () => {
			processChange('data', () => {
				if (config.get('nitro.mode.livereload')) {
					browserSync.reload('*.html');
				}
			});
		});

		// minify-img
		if (config.has('gulp.minifyImg.src') && config.get('gulp.minifyImg.src')) {
			plugins.watch([
				config.get('gulp.minifyImg.src'),
			], () => {
				gulp.start('minify-img');
			});
		}

		// svg-sprite
		if (config.has('gulp.svgSprite.src') && config.get('gulp.svgSprite.src')) {
			plugins.watch([
				config.get('gulp.svgSprite.src'),
			], () => {
				gulp.start('svg-sprite');
			});
		}

		// copy-assets
		if (config.has('gulp.copyAssets.src') && config.get('gulp.copyAssets.src')) {
			plugins.watch([
				config.get('gulp.copyAssets.src'),
			], () => {
				gulp.start('copy-assets');
			});
		}
	};
};
