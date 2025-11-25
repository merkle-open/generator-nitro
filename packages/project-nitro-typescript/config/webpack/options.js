const config = require('config');
const options = {
	rules: {
		js: false,
		ts: true,
		scss: {
			sassOptions: {
				quietDeps: true,
				// color-function and import are muted due to issues in twitter bootstrap scss
				// todo: https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
				silenceDeprecations: ['color-functions', 'import', 'legacy-js-api'],
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
