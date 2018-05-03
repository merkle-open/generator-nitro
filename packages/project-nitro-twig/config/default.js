'use strict';

/**
 * Main Project Config
 * https://www.npmjs.com/package/config
 */

const extend = require('extend');
const baseConfig = require('../app/core/config');
const defaultConfig = {
	assets: require('./default/assets'),
	code: {
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
	},
	exporter: require('./default/exporter'),
};

const config = extend(true, {}, baseConfig, defaultConfig);

module.exports = config;
