'use strict';

const config = require('config');
const pngquant = require('imagemin-pngquant');

module.exports = (gulp, plugins) => {
	return () => {
		return gulp
			.src(config.get('gulp.minifyImg.src'))
			.pipe(plugins.newer(config.get('gulp.minifyImg.dest')))
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
			.pipe(gulp.dest(config.get('gulp.minifyImg.dest')));
	};
};
