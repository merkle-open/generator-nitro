<% if (options.themes) { %>const config = require('config');
const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;
const theme = process.env.THEME ? process.env.THEME : validThemes.find((theme) => theme.isDefault).id;<% } %>
const options = {
	rules: {
		script: <% if (options.jsCompiler === 'ts') { %>{
			typescript: true,
		}<% } else { %>true<% } %>,
		style: {
			publicPath: '../',
			sassOptions: {<% if (options.exampleCode) { %>
				quietDeps: true,
				// color-function and import are muted due to issues in twitter bootstrap scss
				silenceDeprecations: ['color-functions', 'import'],<% } %>
			},
		},
		hbs: <% if (options.clientTpl) { %>true<% } else { %>false<% } %>,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
		imageMinimizer: true,<% if (options.themes) { %>
		theme: theme,<% } %>
	},
};

module.exports = options;
