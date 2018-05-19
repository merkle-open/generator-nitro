'use strict';

const path = require('path');
const fs = require('fs');
const extend = require('extend');
const basePath = path.normalize(path.join(__dirname, '../../'));

const defaultConfig = {
	// assets: {},
	nitro: {
		basePath,
		viewFileExtension: '<%= options.viewExt %>',
		viewDirectory: 'src/views',
		viewPartialsDirectory: 'src/views/_partials',
		viewDataDirectory: 'src/views/_data',
		viewLayoutsDirectory: 'src/views/_layouts',
		placeholdersDirectory: 'src/views/_placeholders',
		defaultLayout: 'default',
		tmpDirectory: 'project/tmp',
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
		// patterns: {},
	},
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
			},
			stylelint: {
				live: true,
			},
		},
	},
	server: {
		port: 8080,
		proxy: 8081,
		production: process.env.NODE_ENV && process.env.NODE_ENV.replace((/\s/g), '') === 'production' ? true : false,
	},
	gulp: {
		dumpViews: {
			/*
			 * used in gulp task `dump-views`
			 * filter corrupt, incomplete or irrelevant views
			 * with the function viewFilter
			 *
			 * example:
			 * viewFilter: (url) => url !== 'incomplete',
			 */
		},
		svgSprite: {
			/*
			 * used in gulp task svg-sprite
			 * generates icon sprite with the name of the last folder in src
			 */
			src: 'src/patterns/atoms/icon/img/icons/*.svg',
			dest: 'public/assets/svg',
		},
		minifyImg: {
			/*
			 * used in gulp task minify-img
			 * copies and minifies all source images to dest folder
			 */
			src: 'src/assets/img/**/*',
			dest: 'public/assets/img',
		},
		copyAssets: {
			/*
			 * used in gulp task copy-assets
			 * copies all sources to dest folder
			 */
			src: 'src/assets/font/**/*.*',
			dest: 'public/assets/font',
		},
	},
	feature: {
		i18next: {
			/*
			 * used in ./i18n.js
			 *
			 * Fallback translation file: project/locales/default/translation.json
			 * Other languages in project/locales/[lang]/translation.json
			 * Language switch with query parameter: ?lang=de
			 */
			options: {
				// defaultNS: 'translation',
				// whitelist: ['en', 'de', 'default'],
				fallbackLng: 'default',
				backend: {
					'loadPath': 'project/locales/{{lng}}/{{ns}}.json',
				},
				detection: {
					// order and from where user language should be detected
					order: ['querystring'],
					// keys or params to lookup language from
					lookupQuerystring: 'lang',
				},
				debug: false,
			},
			middlewareOptions: {
				ignoreRoutes: ['api/', 'assets/', 'dist/', 'proto/'],
			},
		},
	},
};
const warnings = [];

// get legacy config and convert properties to camelCase
function convertToCamelCase(key) {
	return key.replace(/_(.)/g, (match, group1) => {
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
		warnings.push('You still use the outdated config system 1.x with `config.json`. Migrate to the new config system 2.x');
		config = JSON.parse(fs.readFileSync(legacyConfigFile, readOptions));
		if (config.nitro) {
			// view_file_extension -> viewFileExtension, ...
			// (and conversion of other properties from underline notation to camelCase)
			config.nitro = Object.keys(config.nitro).reduce((result, key) => {
				result[convertToCamelCase(key)] = config.nitro[key];
				return result;
			}, {});

			if (config.nitro.compatibility && config.nitro.compatibility.browsers) {
				// config.nitro.compatibility.browsers -> config.nitro.compatibility.browserslist
				config.nitro.compatibility.browserslist = config.nitro.compatibility.browsers;
				delete config.nitro.compatibility.browsers;
			}

			if (config.nitro.patterns) {
				// pattern_prefix -> patternPrefix
				Object.keys(config.nitro.patterns).forEach((pattern) => {
					config.nitro.patterns[pattern] = Object.keys(config.nitro.patterns[pattern]).reduce((result, key) => {
						result[convertToCamelCase(key)] = config.nitro.patterns[pattern][key];
						return result;
					}, {});
				});
			}
		}
	}

	return config;
}
function checkConfig(config) {
	if (config.code.compatibility) {
		warnings.push('Browserslist configuration has to be placed in `package.json`');
	}
	if (warnings.length) {
		console.warn('-------------------------------------------------------');
		console.warn('Attention:');
		warnings.forEach((string) => console.warn(`- ${string}`));
		console.warn('-------------------------------------------------------');
	}
}

// merge with default config
const config = extend(true, {}, defaultConfig, getLegacyConfig());
checkConfig(config);

module.exports = config;
