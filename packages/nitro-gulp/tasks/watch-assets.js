'use strict';

const config = require('config');
const utils = require('../utils/utils');

module.exports = (gulp, plugins) => {

	const throttleBase = config.get('nitro.watch.throttle.base');
	const lastRun = {};

	return () => {
		const browserSync = utils.getBrowserSyncInstance();

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

		plugins.watch(['src/shared/assets/img/**/*'], () => {
			gulp.start('minify-img');
		});

		plugins.watch([
			'src/patterns/atoms/icon/img/icons/*.svg',
		], () => {
			gulp.start('svg-sprite');
		});
	};
};
