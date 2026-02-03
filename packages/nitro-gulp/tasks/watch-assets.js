'use strict';

const config = require('config');
const utils = require('../lib/utils');

/* eslint-disable complexity */
module.exports = (gulp) => {
	const delay = config.get('nitro.watch.delay');
	const projectPath = utils.getProjectPath();

	return () => {
		const options = {
			delay,
			cwd: projectPath,
		};
		const copyAssetsSrc = config.has('gulp.copyAssets')
			? config
					.get('gulp.copyAssets')
					.map((o) => o.src)
					.filter(Boolean)
			: [];
		const minifyImagesSrc = config.has('gulp.minifyImages')
			? config
					.get('gulp.minifyImages')
					.map((o) => o.src)
					.filter(Boolean)
			: [];
		const svgSpritesSrc = config.has('gulp.svgSprites')
			? config
					.get('gulp.svgSprites')
					.flatMap((o) => o.src)
					.filter(Boolean)
			: [];

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
