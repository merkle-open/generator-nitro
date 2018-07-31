'use strict';

const config = require('config');
const pngquant = require('imagemin-pngquant');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const minifyImagesConfigs = config.has('gulp.minifyImages') ? config.get('gulp.minifyImages') : {};
		let stream = utils.getEmptyStream();

		utils.each(minifyImagesConfigs, (minifyImagesConfig) => {
			let minifyStream;
			if (minifyImagesConfig && minifyImagesConfig.src && minifyImagesConfig.dest) {
				minifyStream = gulp
					.src(minifyImagesConfig.src)
					.pipe(plugins.newer(minifyImagesConfig.dest))
					.pipe(
						plugins.imagemin([
							plugins.imagemin.gifsicle({ interlaced: true }),
							plugins.imagemin.jpegtran({ progressive: true }),
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
					.pipe(gulp.dest(minifyImagesConfig.dest));
			} else {
				minifyStream = utils.getEmptyStream();
			}

			stream = merge(stream, minifyStream);
		});

		return stream;
	};
};
