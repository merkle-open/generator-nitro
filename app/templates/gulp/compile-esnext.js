var utils = require('./utils');
var Promise = require('es6-promise').Promise;

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourcePatterns('js');
		var browserSync = utils.getBrowserSyncInstance();

		return Promise.all(
			assets.map(function (asset) {
				return new Promise(function(resolve) {
					gulp.src(asset.src, {base: '.'})
						.pipe(plugins.plumber())
						.pipe(plugins.cached(asset.name))
						.pipe(plugins.eslint())
						.pipe(plugins.eslint.format('stylish'))
						.pipe(plugins.sourcemaps.init({loadMaps: true}))
						.pipe(plugins.babel())
						.pipe(plugins.remember(asset.name))
						.pipe(plugins.concat(asset.name))
						.pipe(plugins.sourcemaps.write('.'))
						.pipe(gulp.dest('public/assets/js'))
						.on('end', resolve)
						.pipe(browserSync.stream());
			});
		}));

		return Promise.all(promises);
	};
};

