'use strict';

/**
 * Init Translation Library i18next
 * Documentation: https://github.com/i18next/i18next-http-middleware
 *
 * Configuration in config package ('./config.js').
 *
 * Use with handlebars translation helper t: `../templating/hbs/helpers/t.js`
 */
const i18next = require('i18next');
const FilesystemBackend = require('i18next-fs-backend');
const sprintf = require('i18next-sprintf-postprocessor');
const i18nextMiddleware = require('i18next-http-middleware');
const config = require('config');
const cloneDeep = require('lodash/cloneDeep');

// The middleware changes options, so we have to deep clone the locked objects
const usei18next = !!config.has('feature.i18next') && config.get('feature.i18next');
const options = config.has('feature.i18next.options') ? cloneDeep(config.get('feature.i18next.options')) : {};
const middlewareOptions = config.has('feature.i18next.middlewareOptions')
	? cloneDeep(config.get('feature.i18next.middlewareOptions'))
	: {};

if (usei18next) {
	i18next.use(i18nextMiddleware.LanguageDetector).use(FilesystemBackend).use(sprintf).init(options);
}

module.exports = function (app) {
	if (usei18next) {
		app.use(i18nextMiddleware.handle(i18next, middlewareOptions));
	}
};
