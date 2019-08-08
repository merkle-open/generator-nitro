const config = require('config');
const options = {
	rules: {
		js: {
			eslint: config.get('code.validation.eslint.live'),
		},
		ts: true,
		scss: {
			stylelint: config.get('code.validation.stylelint.live'),
		},
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
		bundleAnalyzer: false,
		gitInfo: false,
	},
};

module.exports = options;
