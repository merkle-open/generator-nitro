'use strict';

module.exports = (gulp, plugins) => {
	return () => {
		return gulp.start('assets');
	};
};
