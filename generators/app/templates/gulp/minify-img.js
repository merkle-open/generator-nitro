'use strict';

const pngquant = require('imagemin-pngquant');

module.exports = (gulp, plugins) => {
	return () => {
		return gulp
			.src('src/assets/img/**/*')
			.pipe(plugins.newer('public/assets/img'))
			.pipe(plugins.imagemin([
				plugins.imagemin.gifsicle({ interlaced: true }),
				plugins.imagemin.jpegtran({ progressive: true }),
				plugins.imagemin.optipng({ optimizationLevel: 7 }),
				plugins.imagemin.svgo({ plugins: [{ collapseGroups: false }, { cleanupIDs: false }, { removeUnknownsAndDefaults: false }, { removeViewBox: false }] }),
				pngquant(),
			]))
			.pipe(gulp.dest('public/assets/img'));
	};
};
