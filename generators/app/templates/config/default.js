// Main Project Config
// https://www.npmjs.com/package/config

'use strict';

const extend = require('extend');
const baseConfig = require('../app/core/config');
const defaultConfig = {
	assets: require('./default/assets'),
	code: {
		compatibility: {
			browserslist: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1',],
		},
		validation: {
			eslint: {
				live: true,
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
				live: true,
			},
		},
	},
	nitro: {
		patterns: require('./default/patterns'),
		mode: {
			livereload: true,
			minified: false,
			offline: false,
		},
		watch: {
			partials: true,
			throttle: {
				base: 1000,
				cache: 3000,
			},
		},
	},
	server: {
		port: 8080,
		proxy: 8081,
	},<% if (options.exporter) { %>
	exporter: require('./default/exporter'),<% } %><% if (options.release) { %>
	release: require('./default/release'),<% } %>
};

const config = extend(true, {}, baseConfig, defaultConfig);

module.exports = config;
