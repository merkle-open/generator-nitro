var utils = require('./utils');

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourcePatterns('css');

		assets.forEach(function (asset) {
			gulp
				.src('public/assets/css/' + asset.name)
				.pipe(plugins.cssnano({mergeRules: false}))
				.pipe(plugins.rename(asset.name.replace('.css', '.min.css')))
				.pipe(plugins.size({showFiles: true, gzip: false, title: 'CSS minified'}))
				.pipe(plugins.size({showFiles: true, gzip: true, title: 'CSS minified'}))
				.pipe(gulp.dest('public/assets/css/'));
		});

		return gulp;
	};
};
