'use strict';

/**
 * Simple Handlebars Translation Helper
 *
 * @dependency: https://www.npmjs.com/package/i18next
 * http://i18next.com/node/
 *
 * @examples
 * default translation file in project/locales/default/translation.json
 *
 * {{t "test.example.string"}}
 * {{t "test.example.sprintf" "alphabet" "a" "l" "p"}}
 * {{t "test.example.interpolation1" "alphabet" "e" "t"}}
 * {{t "test.example.interpolation2" word="alphabet" one="a"}}
 *
 * It is also possible to use other translation features from i18next (http://i18next.com/node/pages/doc_features.html)
 */
const i18n = require('i18next');
const hbs = require('hbs');

// already initialised in ../core/i18n.js
//const options = {
//	//supportedLngs: ['en', 'de'],
//	//lng: 'de-CH',
//	fallbackLng: 'default',
//	resGetPath: 'project/locales/__lng__/__ns__.json',
//	debug: false
//};
//i18n.init(options);

module.exports = function t (key) {

	const interpolationPrefix = '{';
	const interpolationSuffix = '}';
	const args = [].slice.call(arguments);
	const values = args.slice(1, -1);
	const hash = args.slice(-1)[0].hash;
	let result = i18n.t.apply(i18n, args); // default translations (i18next)
	let regExp;

	// custom replaces from arguments
	values.forEach((item, index) => {
		if (typeof item === 'string') {
			regExp = new RegExp(`\\${interpolationPrefix}${index+1}\\${interpolationSuffix}`, 'g');
			result = result.replace(regExp, item);
		}
		else if (typeof item === 'object') {
			for (let key in item) {
				if (item.hasOwnProperty(key)) {
					regExp = new RegExp(`\\${interpolationPrefix}${key}\\${interpolationSuffix}`, 'g');
					result = result.replace(regExp, item[key]);
				}
			}
		}
	});
	// custom replaces from hash
	if (Object.keys(hash).length !== 0) {
		for (let name in hash) {
			if (hash.hasOwnProperty(name)) {
				regExp = new RegExp(`\\${interpolationPrefix}${name}\\${interpolationSuffix}`, 'g');
				result = result.replace(regExp, hash[name]);
			}
		}
	}

	return new hbs.handlebars.SafeString(result);
};
