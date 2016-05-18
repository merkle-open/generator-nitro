'use strict';

var tUtils = require('../../../core/utils');
var tConfig = require('../../../core/config');
var extend = require('extend');

module.exports = function (Twig) {
	return {
		type: 'component',
		regex: /^component\s+(\S*)\s*([\S\s]+?)?\s*(only)?$/,
		next: [],
		open: true,
		compile: function(token) {
			var expression = token.match[1],
				data = (typeof token.match[2] !== 'undefined') ? token.match[2] : '',
				only = ((token.match[3] !== undefined) && token.match[3].length > 0);

			if (data == 'only' && only === false) {
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
			var innerContext = {},
				component = Twig.expression.parse.apply(this, [token.stack, context]),
				data = Twig.expression.parse.apply(this, [token.variantStack, context]),
				template;

			if (!token.only) {
				innerContext = Twig.ChildContext(context);
			}

			if (component instanceof Twig.Template) {
				template = component;
			} else {
				var url = tConfig.nitro.base_path.concat(tUtils.findTemplate(component));

				// Import file
				template = Twig.Templates.loadRemote(url, {
					method: 'fs',
					base: tConfig.nitro.base_path,
					async: false,
					options: this.options,
					id: url
				});

				if (typeof data === 'object') {
					extend(true, innerContext, data);

				} else if (typeof data === 'string' || typeof data === 'undefined') {
					var dataObject = tUtils.getDataJSON(component, data);
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
