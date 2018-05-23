'use strict';

/**
 * Simple Handlebars Translation Helper
 *
 * @dependency: https://www.npmjs.com/package/i18next
 * http://i18next.com/
 *
 * @examples
 * default translation file in project/locales/default/translation.json
 *
 * {% t 'test.example.string' %}
 * {% t 'test.example.nested' %}
 * {% t 'test.example.sprintf' data=['alphabet', 'a', 'l', 'p'] %}
 * {% t 'test.example.interpolation' data={ name:'developer' } %}
 *
 * It should be also possible to use other translation features from i18next (http://i18next.com/translate/)
 */
const i18next = require('i18next');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 't',
		regex: /^t\s+(\S*)\s*([\S\s]+?)?$/,
		next: [],
		open: true,
		compile: function(token) {

			token.key = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: token.match[1].trim()
			}]).stack;

			if (token.match[2] !== undefined) {
				const keyValueArray = token.match[2].split('=');

				console.log(keyValueArray[1].trim());
				token.data = Twig.expression.compile.apply(this, [{
					type: Twig.expression.type.expression,
					value: keyValueArray[1].trim()
				}]).stack;
			}

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			try {
				const key = Twig.expression.parse.apply(this, [token.key, context]);
				let params = undefined;
				let result = '';

				// check if data attribute was provided in pattern helper
				if (token.data !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					params = Twig.expression.parse.apply(this, [token.data, context]);

					if (params instanceof Array) {
						// type sprintf
						result = i18next.t(key, { postProcess: 'sprintf', sprintf: params });
					} else if (typeof params === 'object') {
						// type interpolation
						result = i18next.t(key, params);
					}
				} else {
					// no params or nested
					result = i18next.t(key, {});
				}

				return {
					chain: chain,
					output: result
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
