const config = require('config');
const options = {
	rules: {
		js: {
			eslint: config.get('code.validation.eslint.live'),
		},
		ts: false,
		scss: {
			stylelint: config.get('code.validation.stylelint.live'),
		},
		hbs: <% if (options.clientTpl) { %>true<% } else { %>false<% } %>,
		woff: true,
		// ⚠ use font rule with care - processes also svg and woff files
		// ⚠ use includes and excludes also in 'image' and 'woff' loader config
		font: false,
		image: true,
	},
	features: {
		bundleAnalyzer: false,
		gitInfo: false,
	},
};

module.exports = options;
