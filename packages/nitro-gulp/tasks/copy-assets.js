'use strict';

const config = require('config');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const copyAssetsConfigs = config.has('gulp.copyAssets') ? config.get('gulp.copyAssets') : {};
		let stream = utils.getEmptyStream();

		utils.each(copyAssetsConfigs, (copyAssetsConfig) => {
			let copyStream;
			if (copyAssetsConfig && copyAssetsConfig.src && copyAssetsConfig.dest) {
				copyStream = gulp
					.src(copyAssetsConfig.src)
					.pipe(plugins.newer(copyAssetsConfig.dest))
					.pipe(gulp.dest(copyAssetsConfig.dest));
			} else {
				copyStream = utils.getEmptyStream();
			}

			stream = merge(stream, copyStream);
		});

		return stream;
	};
};
