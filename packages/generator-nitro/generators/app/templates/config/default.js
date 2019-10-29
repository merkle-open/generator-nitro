'use strict';

/**
 * Main Project Config
 * https://www.npmjs.com/package/config
 */

const extend = require('extend');
const baseConfig = require('@nitro/app/app/core/config');
const defaultConfig = {
	code: {
		validation: {
			eslint: {
				live: false,
			},
			htmllint: {
				live: true,
			},
			jsonSchema: {
				live: true,
				logMissingSchemaAsError: false,
				logMissingSchemaAsWarning: true,
			},
			stylelint: {
				live: false,
			},
		},
	},
	nitro: {
		viewFileExtension: '<%= options.viewExt %>',
		templateEngine: '<%= options.templateEngine %>',
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
	},<% if (options.exporter) { %>
	exporter: require('./default/exporter'),<% } %>
};

const config = extend(true, {}, baseConfig, defaultConfig);

module.exports = config;
