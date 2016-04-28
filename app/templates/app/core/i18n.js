/**
 * Init Translation Library i18next
 * http://i18next.com/node/index.html
 *
 * Configuration:
 * Fallback translation file: project/locales/default/translation.json
 * Other languages in project/locales/[lang]/translation.json
 * Language detection from request header
 * Language switch with query parameter: ?lang=de
 *
 * Use with handlebars translation helper t: `../helpers/t.js`
 */

var i18n = require('i18next');

var options = {
	//supportedLngs: ['en', 'de'],
	//lng: 'de-CH',
	fallbackLng: 'default',
	detectLngQS: 'lang',
	detectLngFromPath: false,
	useCookie: false,
	resGetPath: 'project/locales/__lng__/__ns__.json',
	ignoreRoutes: ['api/', 'assets/'],
	debug: false
};

i18n.init(options);

module.exports = function (app) {
	app.use(i18n.handle);
};
