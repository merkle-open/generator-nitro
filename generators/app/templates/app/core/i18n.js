'use strict';

/**
 * Init Translation Library i18next
 * Documentation: https://www.npmjs.com/package/i18next-express-middleware
 *
 * Configuration in config package ('./config.js').
 *
 * Use with handlebars translation helper t: `../templating/hbs/helpers/t.js`
 */
const i18next = require('i18next');
const FilesystemBackend = require('i18next-node-fs-backend');
const sprintf = require('i18next-sprintf-postprocessor');
const i18nextMiddleware = require('i18next-express-middleware');
const config = require('config');

// The middleware changes options, so we have to clone the locked objects
const options = Object.assign({}, config.get('feature.i18next.options'));
const middlewareOptions = Object.assign({}, config.get('feature.i18next.middlewareOptions'));

i18next
	.use(i18nextMiddleware.LanguageDetector)
	.use(FilesystemBackend)
	.use(sprintf)
	.init(options);

module.exports = function (app) {
	app.use(i18nextMiddleware.handle(i18next, middlewareOptions));
};
