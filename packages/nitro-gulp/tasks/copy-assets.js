'use strict';

const config = require('config');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {
		const streams = [];
		const copyAssetsConfigs = config.has('gulp.copyAssets') ? config.get('gulp.copyAssets') : {};

		utils.each(copyAssetsConfigs, (copyAssetsConfig) => {
			if (copyAssetsConfig && copyAssetsConfig.src && copyAssetsConfig.dest) {
				streams.push(gulp
					.src(copyAssetsConfig.src)
					.pipe(plugins.newer(copyAssetsConfig.dest))
					.pipe(gulp.dest(copyAssetsConfig.dest))
				);
			}
		});

		return streams.length ? merge(...streams) : Promise.resolve('resolved');
	};
};
