'use strict';

const config = require('config');
const extend = require('extend');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'pattern',
		regex: /^pattern\s+(\w+='\S*')\s*(\w+='\S*')?\s*(\w+='\S*')?$/,
		next: [],
		open: true,
		compile: function(token) {

			// get value for name parameter
			const nameKeyValue = token.match[1];
			const nameValue = nameKeyValue.split('=')[1];

			// get value for data parameter
			const dataKeyValue = token.match[2];
			let dataValue = '';

			if (dataKeyValue !== undefined) {
				dataValue = dataKeyValue.split('=')[1];
			}

			// get value for template parameter
			const templateKeyValue = token.match[3];
			let templateValue = '';

			if (templateKeyValue !== undefined) {
				templateValue = templateKeyValue.split('=')[1];
			}

			// compile and store values in token
			token.name = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: nameValue.trim()
			}]).stack;

			token.data = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: dataValue.trim()
			}]).stack;

			token.templateVariation = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: templateValue.trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			const pattern = Twig.expression.parse.apply(this, [token.name, context]);
			const data = Twig.expression.parse.apply(this, [token.data, context]);
			const templateVariation = Twig.expression.parse.apply(this, [token.templateVariation, context]);

			let innerContext = {};
			let template;

			if (pattern instanceof Twig.Template) {
				template = pattern;
			} else {
				const url = config.get('nitro.basePath').concat(twigUtils.findTemplate(pattern, templateVariation));

				// Import file
				template = Twig.Templates.loadRemote(url, {
					method: 'fs',
					base: config.get('nitro.basePath'),
					async: false,
					options: this.options,
					id: url
				});

				if (typeof data === 'object') {
					extend(true, innerContext, data);
				} else if (typeof data === 'string' && data !== '') {
					const dataObject = twigUtils.getDataJSON(pattern, data);
					extend(true, innerContext, dataObject);
				}
			}

			return {
				chain: chain,
				output: template.render(innerContext)
			};
		}
	};
};
