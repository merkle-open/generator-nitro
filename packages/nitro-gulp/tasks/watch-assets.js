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
		const copyAssetsSrc = config.has('gulp.copyAssets') ?
			config.get('gulp.copyAssets').map(o => o.src).filter(Boolean) : [];
		const minifyImagesSrc = config.has('gulp.minifyImages') ?
			config.get('gulp.minifyImages').map(o => o.src).filter(Boolean) : [];
		const svgSpritesSrc = config.has('gulp.svgSprites') ?
			config.get('gulp.svgSprites').map(o => o.src).filter(Boolean) : [];

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

		if (copyAssetsSrc.length) {
			plugins.watch(copyAssetsSrc, options, () => {
				gulp.start('copy-assets');
			});
		}

		if (minifyImagesSrc.length) {
			plugins.watch(minifyImagesSrc, options, () => {
				gulp.start('minify-images');
			});
		}

		if (svgSpritesSrc.length) {
			plugins.watch(svgSpritesSrc, options, () => {
				gulp.start('svg-sprites');
			});
		}
	};
};
/* eslint-enable complexity */
