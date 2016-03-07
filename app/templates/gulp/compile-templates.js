var path = require('path');
var fs = require('fs');
var hbs = require('hbs');
var merge = require('merge-stream');

module.exports = function (gulp, plugins) {
	return function () {

		// register nitro handlebars component helper
		var helpersDir = path.join(__dirname, '../app/helpers');
		fs.readdirSync(helpersDir).forEach(function(helper) {
			var name = helper.replace('.js', '');
			if ('component' === name) {
				hbs.registerHelper(name, require(path.join(helpersDir, name)));
			}
		});

		var templates =  gulp.src('components/**/template/*.hbs')
			// compile nitro component
			.pipe(plugins.change(function (content) {
				var compilePattern = /{{(component)\s[^}]*}}/gi;
				var matches = content.match(compilePattern);
				for (var index in matches) {
					if(matches.hasOwnProperty(index)) {
						var compiled = new hbs.handlebars.SafeString(
							hbs.handlebars.compile(matches[index], {compat: true})()
						);
						content = content.replace(matches[index], compiled);
					}
				}
				return content;
			}))
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars
			}))
			.pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
			.pipe(plugins.declare({
				namespace: 'T.tpl'
			}))
			.pipe(plugins.rename({extname: '.js'}))
			.pipe(gulp.dest('./components'));

		var partials =  gulp.src('components/**/template/partial/*.hbs')
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars
			}))
			.pipe(plugins.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
				imports: {
					processPartialName: function(fileName) {
						// Escape the output with JSON.stringify
						return JSON.stringify(path.basename(fileName, '.js'));
					}
				}
			}))
			.pipe(plugins.rename({extname: '.js'}))
			.pipe(gulp.dest('./components'));

		return merge(templates, partials);
	};
};
