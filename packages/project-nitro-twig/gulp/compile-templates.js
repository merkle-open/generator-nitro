'use strict';

const path = require('path');
const fs = require('fs');
const Twig = require('twig');
const hbs = require('hbs');
const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		// register nitro twig pattern helper
		const helpersDir = path.join(__dirname, '../app/templating/twig/helpers');
		fs.readdirSync(helpersDir).forEach((helper) => {
			const name = helper.replace('.js', '');
			if (name === 'pattern') {
				const patternTagFactory = require(path.join(helpersDir, name));

				Twig.extend(function(Twig) {
					Twig.exports.extendTag(patternTagFactory(Twig));
				});
			}
		});

		const templates = gulp.src('src/patterns/**/template/*.hbs')
			// compile nitro pattern
			.pipe(plugins.change((content) => {
				const compilePattern = /{%\s?(pattern)\s[^]*\s?%}/gi;
				const matches = content.match(compilePattern);

				if (matches) {
					matches.forEach((match) => {
						const template = Twig.twig({ data: match });
						const compiled = template.render({});
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
			.pipe(gulp.dest('./src/patterns'));

		const partials = gulp.src('src/patterns/**/template/partial/*.hbs')
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
			.pipe(gulp.dest('./src/patterns'));

		return merge(templates, partials);
	};
};
