'use strict';

/**
 * twig helper: {% partial Partial Name %}
 *
 * Usage
 * {% partial 'head' %}
 *
 */

const fs = require('fs');
const path = require('path');
const config = require('config');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'partial',
		regex: /^partial\s+('\S*')$/,
		next: [],
		open: true,
		compile: function(token) {

			token.name = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: token.match[1].trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			try {
				const partial = Twig.expression.parse.apply(this, [token.name, context]);
				let innerContext = Twig.ChildContext(context);
				let template;
				let templateFile = `${partial}.${config.get('nitro.viewFileExtension')}`;

				const templateFilePath = path.join(
					config.get('nitro.basePath'),
					config.get('nitro.viewPartialsDirectory'),
					templateFile
				);

				// TODO CHECK WHAT THIS IF SHOULD DO
				if (partial instanceof Twig.Template) {
					template = name;
				} else if (fs.existsSync(templateFilePath)) {
					// Import file
					template = Twig.Templates.loadRemote(templateFilePath, {
						method: 'fs',
						base: '',
						async: false,
						options: this.options,
						id: templateFilePath
					});
				} else {
					return {
						chain: chain,
						output: twigUtils.logAndRenderError(
							new Error(`Partial ${templateFilePath} not found.`)
						)
					};
				}

				return {
					chain: chain,
					output: template.render(innerContext)
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
