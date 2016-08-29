'use strict';

const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		// register nitro handlebars component helper
		const helpersDir = path.join(__dirname, '../app/helpers');
		fs.readdirSync(helpersDir).forEach(function(helper) {
			const name = helper.replace('.js', '');
			if ('component' === name) {
				hbs.registerHelper(name, require(path.join(helpersDir, name)));
			}
		});

		const templates = gulp.src('components/**/template/*.hbs')
			// compile nitro component
			.pipe(plugins.change((content) => {
				const compilePattern = /{{(component)\s[^}]*}}/gi;
				const matches = content.match(compilePattern);
				for (let index in matches) {
					if(matches.hasOwnProperty(index)) {
						const compiled = new hbs.handlebars.SafeString(
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

		const partials = gulp.src('components/**/template/partial/*.hbs')
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars
			}))
			.pipe(plugins.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
				imports: {
					processPartialName: (fileName) => {
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
