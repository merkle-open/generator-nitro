'use strict';

const config = require('config');
const pngquant = require('imagemin-pngquant');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {
		const minifyImagesConfigs = config.has('gulp.minifyImages') ? config.get('gulp.minifyImages') : {};
		const streams = [];

		utils.each(minifyImagesConfigs, (minifyImagesConfig) => {
			if (minifyImagesConfig && minifyImagesConfig.src && minifyImagesConfig.dest) {
				streams.push(
					gulp
						.src(minifyImagesConfig.src)
						.pipe(plugins.newer(minifyImagesConfig.dest))
						.pipe(
							plugins.imagemin([
								plugins.imagemin.mozjpeg({ quality: 75, progressive: true }),
								plugins.imagemin.optipng({ optimizationLevel: 7 }),
								plugins.imagemin.svgo({
									plugins: [
										{ collapseGroups: false },
										{ cleanupIDs: false },
										{ removeUnknownsAndDefaults: false },
										{ removeViewBox: false },
									],
								}),
								pngquant(),
							])
						)
						.pipe(gulp.dest(minifyImagesConfig.dest))
				);
			}
		});

		return streams.length ? merge(...streams) : Promise.resolve('resolved');
	};
};
