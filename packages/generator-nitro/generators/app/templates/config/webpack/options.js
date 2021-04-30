const config = require('config');<% if (options.themes) { %>
const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;
const theme = process.env.THEME ? process.env.THEME : validThemes.find((theme) => theme.isDefault).id;<% } %>
const options = {
	rules: {
		<% if (options.jsCompiler === 'ts') { %>js: false,
		ts: true,<% } else { %>js: {
			eslint: config.get('code.validation.eslint.live'),
		},
		ts: false,<% } %>
		scss: {
			stylelint: config.get('code.validation.stylelint.live'),<% if (options.themes) { %>
			implementation: require('node-sass'),<% } %>
		},
		hbs: <% if (options.clientTpl) { %>true<% } else { %>false<% } %>,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,<% if (options.themes) { %>
		theme: theme,
		dynamicAlias: {
			search: '/theme/light',
			replace: `/theme/${theme}`,
		},<% } %>
	},
};

module.exports = options;
