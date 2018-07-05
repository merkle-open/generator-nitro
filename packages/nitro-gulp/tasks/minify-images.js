'use strict';

const config = require('config');
const pngquant = require('imagemin-pngquant');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const minifyImagesConfig = config.has('gulp.minifyImages') ? config.get('gulp.minifyImages') : {};
		let stream;

		if (minifyImagesConfig && minifyImagesConfig.src && minifyImagesConfig.dest) {

			stream = gulp
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
			stream = utils.getEmptyStream();
		}

		return stream;
	};
};
