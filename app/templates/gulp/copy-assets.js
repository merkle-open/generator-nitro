module.exports = function (gulp, plugins) {
	return function () {
		return gulp
			.src(['assets/font/**/*'])
			.pipe(plugins.newer('public/assets/font'))
			.pipe(gulp.dest('public/assets/font'));
	};
};
