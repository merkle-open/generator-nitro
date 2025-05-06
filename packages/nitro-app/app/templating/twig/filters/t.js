'use strict';

/**
 * Simple Twig Translation Filter
 *
 * @dependency: https://www.npmjs.com/package/i18next
 * http://i18next.com/
 *
 * @examples
 * default translation file in project/locales/default/translation.json
 *
 * {{ 'test.example.string'|t }}
 * {{ 'test.example.interpolation'|t({ name: 'developer' }) }}
 *
 * It should be also possible to use other translation features from i18next (http://i18next.com/translate/)
 */
const i18next = require('i18next');

module.exports = function registerTranslationFilter (Twig) {
	// Register the `t` filter
	Twig.extendFilter('t', (value, args) => {
		try {
			// Twig passes filter args as an array: args[0] is your options object
			const options = args && args[0] ? args[0] : {};
			return i18next.t(value, options);
		} catch (e) {
			console.error('Translation error:', e);
			return value;
		}
	});
};
