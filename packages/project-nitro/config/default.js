'use strict';

/**
 * Main Project Config
 * see '/project/docs/nitro-config.md'
 */

const extend = require('extend');
const baseConfig = require('@nitro/app/app/core/config');
const defaultConfig = {
	code: {
		validation: {
			htmllint: {
				// enabling this live validation slows down rendering
				live: false,
			},
			jsonSchema: {
				live: true,
				logMissingSchemaAsError: false,
				logMissingSchemaAsWarning: true,
			},
		},
	},
	nitro: {
		viewFileExtension: 'hbs',
		templateEngine: 'hbs',
		patterns: require('./default/patterns'),
		mode: {
			livereload: true,
			offline: false,
		},
		watch: {
			partials: true,
			delay: 1000,
		},
	},
	server: {
		port: 8080,
		proxy: {
			port: 8081,
			https: false,
			// example config for https:
			// tip: generate your own certificate with https://github.com/FiloSottile/mkcert
			// https: {
			// 	cert: './project/server/localhost.pem',
			// 	key: './project/server/localhost-key.pem',
			// },
			// host: 'nitro.dev',
			// open: 'external',
		},
	},
	gulp: require('./default/gulp'),
	feature: {
		i18next: {
			middlewareOptions: {
				ignoreRoutes: ['api/', 'assets/', 'dist/', 'content/'],
			},
		},
	},
	exporter: require('./default/exporter'),
	themes: require('./default/themes'),
};

const config = extend(true, {}, baseConfig, defaultConfig);

module.exports = config;
