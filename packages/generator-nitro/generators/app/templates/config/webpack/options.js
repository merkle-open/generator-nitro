const config = require('config');
const options = {
	rules: {
		<% if (options.compiler === 'ts') { %>js: false,
		ts: true,<% } else { %>
		js: {
			eslint: config.get('code.validation.eslint.live'),
		},
		ts: false,<% } %>
		scss: {
			stylelint: config.get('code.validation.stylelint.live'),
		},
		hbs: <% if (options.clientTpl) { %>true<% } else { %>false<% } %>,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
	},
};

module.exports = options;
