const config = require('config');
const options = {
	rules: {
		js: false,
		ts: true,
		scss: {
			sassOptions: {
				quietDeps: true,
				silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'legacy-js-api'],
			},
		},
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
	},
};

module.exports = options;
