'use strict';

const path = require('path');
const fs = require('fs');
<% if (options.templateEngine === 'twig') { %>
const Twig = require('twig');
<% } %>
const hbs = require('hbs');
const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		// register nitro <%= options.templateEngine %> pattern helper
		const helpersDir = path.join(__dirname, '../app/templating/<%= options.templateEngine %>/helpers');
		fs.readdirSync(helpersDir).forEach((helper) => {
			const name = helper.replace('.js', '');
			if (name === 'pattern') {
				<% if (options.templateEngine === 'twig') { %>
				const patternTagFactory = require(path.join(helpersDir, name));

				Twig.extend(function(Twig) {
					Twig.exports.extendTag(patternTagFactory(Twig));
				});
				<% } else { %>
				hbs.registerHelper(name, require(path.join(helpersDir, name)));
				<% } %>
			}
		});

		const templates = gulp.src('src/patterns/**/template/*.hbs')
			// compile nitro pattern
			.pipe(plugins.change((content) => {
				<% if (options.templateEngine === 'twig') { %>
				const compilePattern = /{%\s?(pattern)\s[^]*\s?%}/gi;
				<% } else { %>
				const compilePattern = /{{(pattern)\s[^}]*}}/gi;
				<% } %>

				const matches = content.match(compilePattern);
				if (matches) {
					matches.forEach((match) => {
						<% if (options.templateEngine === 'twig') { %>
						const template = Twig.twig({ data: match });
						const compiled = template.render({});
						<% } else { %>
						const compiled = new hbs.handlebars.SafeString(
							hbs.handlebars.compile(match, { compat: true })()
						);
						<% } %>

						content = content.replace(match, compiled);
					});
				}
				return content;
			}))
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars,
			}))
			.pipe(plugins.wrap('Handlebars.template(<%%= contents %%>)'))
			.pipe(plugins.declare({
				namespace: 'T.tpl',
			}))
			.pipe(plugins.rename({ extname: '.js' }))
			.pipe(gulp.dest('./src/patterns'));

		const partials = gulp.src('src/patterns/**/template/partial/*.hbs')
			.pipe(plugins.handlebars({
				handlebars: hbs.handlebars,
			}))
			.pipe(plugins.wrap('Handlebars.registerPartial(<%%= processPartialName(file.relative) %%>, Handlebars.template(<%%= contents %%>));', {}, {
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
