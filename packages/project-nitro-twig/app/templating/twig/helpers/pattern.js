'use strict';

const config = require('config');
const extend = require('extend');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'pattern',
		regex: /^pattern\s+(\S*)\s*([\S\s]+?)?\s*(only)?$/,
		next: [],
		open: true,
		compile: function(token) {
			const expression = token.match[1];
			let data = (typeof token.match[2] !== 'undefined') ? token.match[2] : '';
			let only = ((token.match[3] !== undefined) && token.match[3].length > 0);

			if (data === 'only' && only === false) {
				data = '';
				only = true;
			}

			token.only = only;

			token.stack = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: expression.trim()
			}]).stack;

			token.variantStack = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: data.trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			const component = Twig.expression.parse.apply(this, [token.stack, context]);
			const data = Twig.expression.parse.apply(this, [token.variantStack, context]);
			let innerContext = {};
			let template;

			if (!token.only) {
				innerContext = Twig.ChildContext(context);
			}

			if (component instanceof Twig.Template) {
				template = component;
			} else {
				const url = config.get('nitro.basePath').concat(twigUtils.findTemplate(component));

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

				} else if (typeof data === 'string' || typeof data === 'undefined') {
					const dataObject = twigUtils.getDataJSON(component, data);
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
