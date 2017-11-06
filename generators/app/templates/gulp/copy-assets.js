'use strict';

const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		const fonts = gulp
			.src(['src/assets/font/**/*.*'])
			.pipe(plugins.newer('public/assets/font'))
			.pipe(gulp.dest('public/assets/font'));

		return merge(fonts);
	};
};
