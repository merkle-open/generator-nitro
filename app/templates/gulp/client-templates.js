// Based on: http://enehana.nohea.com/general/using-handlebars-js-templates-as-precompiled-js-files/
var utils = require('./utils');
var Promise = require('es6-promise').Promise;
var globby = require('globby');
// FIXME does not yet work with autoloader plugins
var handlebars = require('gulp-handlebars');

module.exports = function (gulp, plugins) {
	return function () {
		var promises = [];

		// compile templates
		globby('components/**/template/*.hbs').then(function (paths) {
			paths.forEach(function (path) {
				promises.push(new Promise(function (resolve) {
					gulp.src(path)
						.pipe(handlebars())
						.pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
						.pipe(plugins.declare({
							namespace: 'T.tpl',
							noRedeclare: true // Avoid duplicate declarations
						}))
						.pipe(plugins.rename(path.replace('.hbs', '.js')))
						.pipe(gulp.dest(''))
						.on('end', function () {
							resolve();
						});
				}));
			});
		});

		return Promise.all(promises);
	};
};
