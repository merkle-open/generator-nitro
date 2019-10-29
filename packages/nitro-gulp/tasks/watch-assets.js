'use strict';

const config = require('config');
const utils = require('../lib/utils');

/* eslint-disable complexity */
module.exports = (gulp) => {

	const delay = config.get('nitro.watch.throttle.base');
	const projectPath = utils.getProjectPath();

	return () => {
		const browserSync = utils.getBrowserSyncInstance();
		const reloadBrowser = (done) => {
			browserSync.reload('*.html');
			done();
		};
		const options = {
			delay,
			cwd: projectPath,
		};
		const copyAssetsSrc = config.has('gulp.copyAssets') ?
			config.get('gulp.copyAssets').map(o => o.src).filter(Boolean) : [];
		const minifyImagesSrc = config.has('gulp.minifyImages') ?
			config.get('gulp.minifyImages').map(o => o.src).filter(Boolean) : [];
		const svgSpritesSrc = config.has('gulp.svgSprites') ?
			config.get('gulp.svgSprites').map(o => o.src).filter(Boolean) : [];

		if (config.get('nitro.mode.livereload')) {
			gulp.watch([
				`src/views/**/*.${config.get('nitro.viewFileExtension')}`,
				`${config.get('nitro.viewDataDirectory')}/**/*.json`,
				`src/patterns/**/*.${config.get('nitro.viewFileExtension')}`,
				'!src/patterns/**/template/**/*.hbs',
				'src/patterns/**/schema.json',
				'src/patterns/**/_data/*.json',
			], options, reloadBrowser);
		}

		if (copyAssetsSrc.length) {
			gulp.watch(copyAssetsSrc, options, gulp.series('copy-assets'));
		}

		if (minifyImagesSrc.length) {
			gulp.watch(minifyImagesSrc, options, gulp.series('minify-images'));
		}

		if (svgSpritesSrc.length) {
			gulp.watch(svgSpritesSrc, options, gulp.series('svg-sprites'));
		}
	};
};
/* eslint-enable complexity */
