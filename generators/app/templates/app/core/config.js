'use strict';

const path = require('path');
const fs = require('fs');
const extend = require('extend');
const basePath = path.normalize(path.join(__dirname, '../../'));

const defaultConfig = {
	// assets: {},
	nitro: {
		basePath: basePath,
		viewFileExtension: '<%= options.viewExt %>',
		viewDirectory: 'views',
		viewPartialsDirectory: 'views/_partials',
		viewDataDirectory: 'views/_data',
		viewLayoutsDirectory: 'views/_layouts',
		placeholdersDirectory: 'views/_placeholders',
		defaultLayout: 'default',
		mode: {
			offline: false
		},
		watch: {
			throttle: {
				base: 1000,
				cache: 3000,
			}
		},
		// patterns: {},
	},
	code: {
		compatibility: {
			browsers: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1',],
		},
		validation: {
			eslint: {
				live: true
			},
			htmllint: {
				live: true,
			},
			jsonSchema: {
				live: true,
			},
			stylelint: {
				live: true
			},
		},
	},
	server: {
		port: 8080,
		proxy: 8081,
		production: process.env.NODE_ENV && process.env.NODE_ENV.replace((/\s/g), '') === 'production' ? true : false,
	},
};

// get legacy config and convert properties to camelCase
function convertToCamelCase(key) {
	return key.replace(/_(.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
}
function getLegacyConfig() {
	let config = {};
	const legacyConfigFile = `${basePath}config.json`;
	const readOptions = {
		encoding: 'utf-8',
		flag: 'r',
	};

	if (fs.existsSync(legacyConfigFile)) {
		console.log('-------------------------------------------------------');
		console.log('Attention: you still use the outdated config system 1.x with `config.json`.');
		console.log('You should migrate to the new config system 2.x');
		console.log('-------------------------------------------------------');
		config = JSON.parse(fs.readFileSync(legacyConfigFile, readOptions));
		if (config.nitro) {
			// view_file_extension -> viewFileExtension, ...
			// (and conversion of other properties from underline notation to camelCase)
			config.nitro = Object.keys(config.nitro).reduce((result, key) => {
				result[convertToCamelCase(key)] = config.nitro[key];
				return result;
			}, {});

			if (config.nitro.patterns) {
				// pattern_prefix -> patternPrefix
				Object.keys(config.nitro.patterns).forEach((pattern) => {
					config.nitro.patterns[pattern] = Object.keys(config.nitro.patterns[pattern]).reduce(function(result, key) {
						result[convertToCamelCase(key)] = config.nitro.patterns[pattern][key];
						return result;
					}, {})
				});
			}
		}
	}

	return config;
}

// merge with default config
const config = extend(true, {}, defaultConfig, getLegacyConfig());

module.exports = config;
