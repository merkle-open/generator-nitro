'use strict';

/**
 * twig helper: {% placeholder name='PlaceholderName' template='TemplateName' %}
 *
 * Usage
 * {% placeholder name='TeaserArea' template='default' %}
 *
 */

const fs = require('fs');
const path = require('path');
const extend = require('extend');
const config = require('config');
const twigUtils = require('../utils');
const lint = require('../../../lib/lint');
const htmllintOptions = lint.getHtmllintOptions(true);

module.exports = function (Twig) {
	return {
		type: 'placeholder',
		regex: /^placeholder\s+(\w+='\S*')\s*(\w+='\S*')?\s*([\S\s]+?)?$/,
		next: [],
		open: true,
		compile: function(token) {

			token.match.map((paramKeyValue, index) => {
				// our params are available in indexes 1-3
				if (index > 0 && index < 4) {

					// if the param in question is defined, we split the key=value pair and compile a twig expression
					if (paramKeyValue !== undefined) {
						const keyValueArray = paramKeyValue.split('=');
						let key = keyValueArray[0];
						const value = keyValueArray[1];

						token[key] = Twig.expression.compile.apply(this, [{
							type: Twig.expression.type.expression,
							value: value.trim()
						}]).stack;
					}
				}
			});

			delete token.match;

			return token;
		},
		parse: function(token, context, chain) {
			try {
				let name = '';
				let templateFile = '';
				let additionalData = null;
				let template;
				const placeholderData = {};

				// check if name attribute was provided in placeholder helper
				if (token.name !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					name = Twig.expression.parse.apply(this, [token.name, context]);
				} else {
					return {
						chain: chain,
						output: twigUtils.logAndRenderError(
							new Error('Placeholder name parameter not set')
						)
					};
				}

				// check if template was provided in placeholder helper
				if (token.template !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					templateFile = Twig.expression.parse.apply(this, [token.template, context]);
				} else {
					return {
						chain: chain,
						output: twigUtils.logAndRenderError(
							new Error('Placeholder template parameter not set')
						)
					};
				}

				// check if additional data was provided in placeholder helper
				if (token.additionalData !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					additionalData = Twig.expression.parse.apply(this, [token.additionalData, context]);
				}

				// merge global view data with placeholderData
				if (context._locals) {
					extend(true, placeholderData, context._locals);
				}

				// merge query data with placeholderData
				if (context._query) {
					extend(true, placeholderData, context._query);
				}

				// Add additional attributes e.g. {% placeholder name="TeaserArea" additionalData={ teaserItems: [...] } %}
				if (additionalData !== null) {
					for (let key in additionalData) {
						if (additionalData.hasOwnProperty(key)) {
							// extend or override placeholderData with additional data
							placeholderData[key] = additionalData[key];
						}
					}
				}

				templateFile += `.${config.get('nitro.viewFileExtension')}`;

				const templateFilePath = path.join(
					config.get('nitro.basePath'),
					config.get('nitro.placeholdersDirectory'),
					name,
					templateFile);

				// TODO CHECK WHAT THIS IF SHOULD DO
				if (name instanceof Twig.Template) {
					template = name;
				} else if (fs.existsSync(templateFilePath)) {
					// otherwise try to load it
					try {
						// Import file
						template = Twig.Templates.loadRemote(templateFilePath, {
							method: 'fs',
							base: '',
							async: false,
							options: this.options,
							id: templateFilePath,
						});

					} catch (e) {
						return {
							chain: chain,
							output: twigUtils.logAndRenderError(
								new Error(`Parse Error for Placeholder ${name}: ${e.message}`)
							)
						};
					}
				} else {
					return {
						chain: chain,
						output: twigUtils.logAndRenderError(
							new Error(`Placeholder ${templateFilePath} not found.`)
						)
					};
				}

				const html = template.render(placeholderData);

				// lint html snippet
				if (!config.get('server.production') && config.get('code.validation.htmllint.live')) {
					lint.lintSnippet(templateFilePath, html, htmllintOptions);
				}

				// return the rendered template
				return {
					chain: chain,
					output: html
				};

			} catch (e) {
				return {
					chain: chain,
					output: twigUtils.logAndRenderError(e)
				};
			}
		}
	};
};
