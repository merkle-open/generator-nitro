'use strict';

/**
 * Init Translation Library i18next
 * Documentation: https://www.npmjs.com/package/i18next-express-middleware
 *
 * Configuration:
 * Fallback translation file: project/locales/default/translation.json
 * Other languages in project/locales/[lang]/translation.json
 * Language detection from request header
 * Language switch with query parameter: ?lang=de
 *
 * Use with handlebars translation helper t: `../templating/hbs/helpers/t.js`
 */
const i18next = require('i18next');
const FilesystemBackend = require('i18next-node-fs-backend');
const sprintf = require('i18next-sprintf-postprocessor');
const i18nextMiddleware = require('i18next-express-middleware');

const options = {
	// defaultNS: 'translation',
	// whitelist: ['en', 'de', 'default'],
	fallbackLng: 'default',
	backend: {
		'loadPath': 'project/locales/{{lng}}/{{ns}}.json',
	},
	detection: {
		// order and from where user language should be detected
		order: ['querystring', 'header'],
		// keys or params to lookup language from
		lookupQuerystring: 'lang',
	},
	debug: false,
};
const middlewareOptions = {
	ignoreRoutes: ['api/', 'assets/', 'dist/'],
};

i18next
	.use(i18nextMiddleware.LanguageDetector)
	.use(FilesystemBackend)
	.use(sprintf)
	.init(options);

module.exports = function (app) {
	app.use(i18nextMiddleware.handle(i18next, middlewareOptions));
};
