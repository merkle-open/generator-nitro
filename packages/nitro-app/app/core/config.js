'use strict';

const path = require('path');
const extend = require('extend');
const basePath = `${path.normalize(process.cwd())}/`;

const defaultConfig = {
	nitro: {
		basePath,
		viewFileExtension: 'hbs',
		viewDirectory: 'src/views',
		viewPartialsDirectory: 'src/views/_partials',
		viewDataDirectory: 'src/views/_data',
		viewLayoutsDirectory: 'src/views/_layouts',
		placeholdersDirectory: 'src/views/_placeholders',
		defaultLayout: 'default',
		view404: '404',
		tmpDirectory: 'project/tmp',
		templateEngine: 'hbs',
		mode: {
			livereload: true,
			offline: false,
			test: !!(process.env.NITRO_MODE && process.env.NITRO_MODE.replace(/\s/g, '') === 'test'),
		},
		watch: {
			partials: true,
			delay: 1000,
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
		proxy: {
			port: 8081,
			https: false,
		},
		production: !!(process.env.NODE_ENV && process.env.NODE_ENV.replace(/\s/g, '') === 'production'),
		compression: true,
		projectPaths: [
			'config',
			'project/helpers',
			'project/locales',
			'project/routes',
			'project/server',
			'project/viewData',
			'public',
			'src/views',
			'src/patterns/',
			'.node-version',
		],
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
		copyAssets: [
			/*
			 * used in gulp task copy-assets
			 * copies all sources to dest folder
			 */
			{
				src: '',
				dest: '',
			},
		],
		minifyImages: [
			/*
			 * used in gulp task minify-images
			 * copies and minifies all source images to dest folder
			 */
			{
				src: '',
				dest: '',
			},
		],
		svgSprites: [
			/*
			 * used in gulp task svg-sprites
			 * generates icon sprite with the name of the last folder in src
			 */
			{
				src: '',
				dest: '',
			},
		],
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
				// supportedLngs: ['en', 'de', 'default'],
				fallbackLng: 'default',
				backend: {
					loadPath: 'project/locales/{{lng}}/{{ns}}.json',
				},
				detection: {
					// order and from where user language should be detected
					order: ['querystring'],
					// keys or params to lookup language from
					lookupQuerystring: 'lang',
				},
				// compatibilityJSON: 'v3',
				debug: false
			},
			middlewareOptions: {
				ignoreRoutes: ['api/', 'assets/', 'dist/', 'proto/'],
			},
		},
	},
	exporter: false,
	themes: false,
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
