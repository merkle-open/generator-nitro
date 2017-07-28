'use strict';

const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		// register nitro handlebars pattern helper
		const helpersDir = path.join(__dirname, '../app/templating/hbs/helpers');
		fs.readdirSync(helpersDir).forEach((helper) => {
			const name = helper.replace('.js', '');
			if (name === 'pattern') {
				hbs.registerHelper(name, require(path.join(helpersDir, name)));
			}
		});

		const templates = gulp.src('patterns/**/template/*.hbs')
			// compile nitro pattern
			.pipe(plugins.change((content) => {
				const compilePattern = /{{(pattern)\s[^}]*}}/gi;
				const matches = content.match(compilePattern);
				if (matches) {
					matches.forEach((match) => {
						const compiled = new hbs.handlebars.SafeString(
							hbs.handlebars.compile(match, { compat: true })()
						);
						content = content.replace(match, compiled);
					});
				}
				return content;
			}))
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars,
			}))
			.pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
			.pipe(plugins.declare({
				namespace: 'T.tpl',
			}))
			.pipe(plugins.rename({ extname: '.js' }))
			.pipe(gulp.dest('./patterns'));

		const partials = gulp.src('patterns/**/template/partial/*.hbs')
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars,
			}))
			.pipe(plugins.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
				imports: {
					processPartialName: (fileName) => {
						// Escape the output with JSON.stringify
						return JSON.stringify(path.basename(fileName, '.js'));
					},
				},
			}))
			.pipe(plugins.rename({ extname: '.js' }))
			.pipe(gulp.dest('./patterns'));

		return merge(templates, partials);
	};
};
