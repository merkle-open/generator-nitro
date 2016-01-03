var utils = require('./utils');

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourceFiles('.js');

		assets.forEach(function (asset) {
			gulp
				.src('public/assets/js/' + asset.name)
				.pipe(plugins.uglify())
				.pipe(plugins.rename(asset.name.replace('.js', '.min.js')))
				.pipe(plugins.size({showFiles: true, gzip: true, title: 'JavaScript minified'}))
				.pipe(gulp.dest('public/assets/js/'));
		});

		return gulp;
	};
};

