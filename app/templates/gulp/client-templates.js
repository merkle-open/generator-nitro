var hbs = require('hbs');

module.exports = function (gulp, plugins) {
	return function () {
		return gulp.src('components/**/template/*.hbs')
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars
			}))
			.pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
			.pipe(plugins.declare({
				namespace: 'T.tpl',
				noRedeclare: true
			}))
			.pipe(plugins.rename({extname: '.js'}))
			.pipe(gulp.dest('./components'));
	};
};
