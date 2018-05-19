'use strict';

const config = require('config');

module.exports = (gulp, plugins) => {

	return () => {
		const stream = gulp
			.src([config.get('gulp.copyAssets.src')])
			.pipe(plugins.newer(config.get('gulp.copyAssets.dest')))
			.pipe(gulp.dest(config.get('gulp.copyAssets.dest')));

		return stream;
	};
};
