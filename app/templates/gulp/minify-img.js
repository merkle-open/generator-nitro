var pngquant = require('imagemin-pngquant');

module.exports = function (gulp, plugins) {
	return function () {
		return gulp
			.src('assets/img/**/*')
			.pipe(plugins.newer('public/assets/img'))
			.pipe(plugins.imagemin({
				optimizationLevel: 7,
				progressive: true,
				multipass: true,
				svgoPlugins: [{collapseGroups: false}, {cleanupIDs: false}, {removeUnknownsAndDefaults: false}, {removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest('public/assets/img'));
	};
};
