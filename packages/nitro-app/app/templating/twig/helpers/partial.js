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
		compile(token) {
			token.name = Twig.expression.compile.apply(this, [
				{
					type: Twig.expression.type.expression,
					value: token.match[1].trim(),
				},
			]).stack;

			delete token.match;
			return token;
		},
		parse(token, context, chain) {
			try {
				const partial = Twig.expression.parse.apply(this, [token.name, context]);
				const innerContext = { ...context };
				let template;
				const templateFile = `${partial}.${config.get('nitro.viewFileExtension')}`;

				const templateFilePath = path.join(
					config.get('nitro.basePath'),
					config.get('nitro.viewPartialsDirectory'),
					templateFile
				);

				// TODO CHECK WHAT THIS IF SHOULD DO
				if (typeof partial === 'object' && partial && typeof partial.render === 'function') {
					template = partial;
				} else if (fs.existsSync(templateFilePath)) {
					template = Twig.exports.loadRemoteTemplate(templateFilePath);
				} else {
					return {
						chain,
						output: twigUtils.logAndRenderError(new Error(`Partial ${templateFilePath} not found.`)),
					};
				}

				return {
					chain,
					output: template.render(innerContext),
				};
			} catch (e) {
				return {
					chain,
					output: twigUtils.logAndRenderError(e),
				};
			}
		},
	};
};
