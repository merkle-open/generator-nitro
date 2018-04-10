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
 * {{t 'test.example.string'}}
 * {{t 'test.example.sprintf' 'alphabet' 'a' 'l' 'p'}}
 * {{t 'test.example.interpolation' word='alphabet' one='a'}}
 *
 * It should be also possible to use other translation features from i18next (http://i18next.com/translate/)
 */
const i18next = require('i18next');
const hbs = require('hbs');

// initialised in ../../../core/i18n.js

module.exports = function t(key) {

	const context = arguments[arguments.length - 1];
	const contextDataRoot = context.data && context.data.root ? context.data.root : {};
	const args = [].slice.call(arguments);
	const values = args.slice(1, -1);
	const hash = args.slice(-1)[0].hash;

	let result = `|${key}|`;

	if (contextDataRoot.language) {
		i18next.changeLanguage(contextDataRoot.language);
	}

	if (args.length === 2) {
		// no arguments, optional hash for interpolation
		result = i18next.t(key, hash);
	} else if (args.length === 3 && typeof args[1] === 'object') {
		// interpolation using data object
		result = i18next.t(key, args[1]);
	} else if (args.length > 2) {
		// values for sprintf
		result = i18next.t(key, { postProcess: 'sprintf', sprintf: values });
	}

	return new hbs.handlebars.SafeString(result);
};
