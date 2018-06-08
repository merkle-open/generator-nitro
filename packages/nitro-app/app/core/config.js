'use strict';

const path = require('path');
const extend = require('extend');
const basePath = `${path.normalize(process.cwd())}/`;

const defaultConfig = {
	// assets: {},
	nitro: {
		basePath,
		viewFileExtension: 'hbs',
		viewDirectory: 'src/views',
		viewPartialsDirectory: 'src/views/_partials',
		viewDataDirectory: 'src/views/_data',
		viewLayoutsDirectory: 'src/views/_layouts',
		placeholdersDirectory: 'src/views/_placeholders',
		defaultLayout: 'default',
		tmpDirectory: 'project/tmp',
		templateEngine: 'hbs',
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
		production: !!(process.env.NODE_ENV && process.env.NODE_ENV.replace((/\s/g), '') === 'production'),
		compression: true,
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

/* eslint-disable no-console */
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
/* eslint-enable no-console */

// merge with default config
const config = extend(true, {}, defaultConfig);
checkConfig(config);

module.exports = config;
