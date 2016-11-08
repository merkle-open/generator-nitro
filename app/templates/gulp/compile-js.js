var utils = require('./utils');
var Promise = require('es6-promise').Promise;

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourcePatterns('js');
		var browserSync = utils.getBrowserSyncInstance();

		return Promise.all(
			assets.map(function (asset) {
				<% if (options.js === 'TypeScript') { %>
					var tsAssets = utils.splitJsAssets(asset);
					tsAssets.js.push('public/assets/js/' + asset.name.replace('.js', '.ts.js'));
				<% } %>
				return new Promise(function(resolve) {
					gulp.src(<% if (options.js === 'TypeScript') { %>tsAssets.js<% } else { %>asset.src<% } %>, {base: '.'})
						.pipe(plugins.plumber())
						.pipe(plugins.cached(asset.name))
						.pipe(plugins.sourcemaps.init({loadMaps: true}))
						.pipe(plugins.jshint())
						.pipe(plugins.jshint.reporter('jshint-stylish'))
						.pipe(plugins.remember(asset.name))
						.pipe(plugins.concat(asset.name))
						.pipe(plugins.sourcemaps.write('.'))
						.pipe(gulp.dest('public/assets/js'))
						.on('end', function () {
							resolve();
						})
						.pipe(browserSync.stream());
			});
		}));
	};
};

