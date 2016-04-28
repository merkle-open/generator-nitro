var utils = require('./utils');
var Promise = require('es6-promise').Promise;
var globby = require('globby');
var fs = require('fs');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer');

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourceFiles('.css');
		var promises = [];

		assets.forEach(function (asset) {
			promises.push(new Promise(function (resolve) {
				var processors = [
					autoprefixer({
						browsers: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1'],
						cascade: true
					})
				];
				var imports = '';

				globby.sync(asset.deps).forEach(function (path) {
					imports += fs.readFileSync(path, 'utf8');
				});

				gulp.src(asset.src, {base: '.'})
					.pipe(plugins.plumber())
					.pipe(plugins.cached(asset.name))
					.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.header(imports, false))
					<% if (options.pre === 'scss') { %>.pipe(plugins.sass().on('error', plugins.sass.logError ))<% } else { %>.pipe(plugins.less().on('error', function(err) {
						console.log(err.message);
						this.emit('end');
					}))<% } %>
					.pipe(plugins.postcss(processors))
					.pipe(plugins.remember(asset.name))
					.pipe(plugins.concat(asset.name))
					.pipe(plugins.sourcemaps.write('.'))
					.pipe(gulp.dest('public/assets/css/'))
					.on('end', function () {
						resolve();
					})
					.pipe(browserSync.reload({stream: true}));
			}));
		});

		return Promise.all(promises);
	};
};

