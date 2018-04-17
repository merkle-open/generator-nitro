'use strict';

const config = require('config');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'partial',
		regex: /^partial\s+(\w+='\S*')$/,
		next: [],
		open: true,
		compile: function(token) {

			const nameKeyValue = token.match[1];
			const name = nameKeyValue.split('=')[1];

			token.name = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: name.trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			const partial = Twig.expression.parse.apply(this, [token.name, context]);
			let innerContext = {};
			let template;

			if (partial instanceof Twig.Template) {
				template = partial;
			} else {
				const url = config.get('nitro.basePath').concat(twigUtils.findPartial(partial));

				// Import file
				template = Twig.Templates.loadRemote(url, {
					method: 'fs',
					base: config.get('nitro.basePath'),
					async: false,
					options: this.options,
					id: url
				});
			}

			return {
				chain: chain,
				output: template.render(innerContext)
			};
		}
	};
};
