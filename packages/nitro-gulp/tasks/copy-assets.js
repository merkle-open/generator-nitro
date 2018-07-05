'use strict';

const config = require('config');
// const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const copyAssetsConfig = config.has('gulp.copyAssets') ? config.get('gulp.copyAssets') : {};
		let stream;

		if (copyAssetsConfig && copyAssetsConfig.src && copyAssetsConfig.dest) {
			stream = gulp
				.src(copyAssetsConfig.src)
				.pipe(plugins.newer(copyAssetsConfig.dest))
				.pipe(gulp.dest(copyAssetsConfig.dest));
		} else {
			stream = utils.getEmptyStream();
		}

		return stream;
		// return merge(stream);
	};
};
