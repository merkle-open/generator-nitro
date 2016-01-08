var utils = require('./utils');
var Promise = require('es6-promise').Promise;
var globby = require('globby');
var fs = require('fs');
var browserSync = require('browser-sync');

module.exports = function (gulp, plugins) {
	return function () {
		var assets = utils.getSourceFiles('.css');
		var promises = [];

		assets.forEach(function (asset) {
			promises.push(new Promise(function (resolve) {
				globby(asset.deps).then(function (paths) {
					var imports = '';

					paths.forEach(function (path) {
						imports += fs.readFileSync(path);
					});

					gulp.src(asset.src)
						.pipe(plugins.plumber())
						.pipe(plugins.header(imports))
						.pipe(plugins.cached(asset.name))
						<% if (options.pre === 'scss') { %>.pipe(plugins.sass().on('error', plugins.sass.logError ))<% } else { %>.pipe(plugins.less().on('error', function(err) {
							console.log(err.message);
							this.emit('end');
						}))<% } %>
						.pipe(plugins.autoprefixer({
							browsers: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1'],
							cascade: true
						}))
						.pipe(plugins.remember(asset.name))
						.pipe(plugins.concat(asset.name))
						.pipe(gulp.dest('public/assets/css/'))
						.on('end', function () {
							resolve();
						})
						.pipe(browserSync.reload({stream: true}));
				});
			}));
		});

		return Promise.all(promises);
	};
};

