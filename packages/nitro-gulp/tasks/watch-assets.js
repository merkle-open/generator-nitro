'use strict';

const config = require('config');
const utils = require('../utils/utils');

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
		const minifyImgSrc = config.has('gulp.minifyImg.src') ? config.get('gulp.minifyImg.src') : false;
		const svgSpriteSrc = config.has('gulp.svgSprite.src') ? config.get('gulp.svgSprite.src') : false;

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

		if (minifyImgSrc) {
			plugins.watch(minifyImgSrc, options, () => {
				gulp.start('minify-img');
			});
		}

		if (svgSpriteSrc) {
			plugins.watch(svgSpriteSrc, options, () => {
				gulp.start('svg-sprite');
			});
		}
	};
};
/* eslint-enable complexity */
