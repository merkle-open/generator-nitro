'use strict';

module.exports = (gulp, plugins) => {
	return () => {
		return gulp
			.src(['assets/font/**/*'])
			.pipe(plugins.newer('public/assets/font'))
			.pipe(gulp.dest('public/assets/font'));
	};
};
