'use strict';

const config = require('config');
const utils = require('../lib/utils');

/* eslint-disable complexity */
module.exports = (gulp, plugins) => {

	const throttleBase = config.get('nitro.watch.throttle.base');
	const lastRun = {};
	const projectPath = utils.getProjectPath();

	const processChange = (type, func, throttle) => {
		type = type || 'other';
		func = func || function () {};
		throttle = throttle || throttleBase;

		// call function only once in defined time
		lastRun[type] = lastRun[type] || 0;
		if (new Date() - lastRun[type] > throttle) {
			func();
		}
		lastRun[type] = new Date();
	};

	return () => {
		const browserSync = utils.getBrowserSyncInstance();
		const options = {
			base: projectPath,
			read: false,
		};
		const copyAssetsSrc = config.has('gulp.copyAssets.src') ? config.get('gulp.copyAssets.src') : false;
		const minifyImagesSrc = config.has('gulp.minifyImages.src') ? config.get('gulp.minifyImages.src') : false;
		const svgSpritesSrc = config.has('gulp.svgSprites.src') ? config.get('gulp.svgSprites.src') : false;

		if (config.get('nitro.mode.livereload')) {
			plugins.watch([
				`src/views/**/*.${config.get('nitro.viewFileExtension')}`,
				`${config.get('nitro.viewDataDirectory')}/**/*.json`,
				`src/patterns/**/*.${config.get('nitro.viewFileExtension')}`,
				'!src/patterns/**/template/**/*.hbs',
				'src/patterns/**/schema.json',
				'src/patterns/**/_data/*.json',
			], options, () => {
				processChange('data', () => {
					browserSync.reload('*.html');
				});
			});
		}

		if (copyAssetsSrc) {
			plugins.watch(copyAssetsSrc, options, () => {
				gulp.start('copy-assets');
			});
		}

		if (minifyImagesSrc) {
			plugins.watch(minifyImagesSrc, options, () => {
				gulp.start('minify-images');
			});
		}

		if (svgSpritesSrc) {
			plugins.watch(svgSpritesSrc, options, () => {
				gulp.start('svg-sprites');
			});
		}
	};
};
/* eslint-enable complexity */
