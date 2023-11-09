const config = require('config');<% if (options.themes) { %>
const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;
const theme = process.env.THEME ? process.env.THEME : validThemes.find((theme) => theme.isDefault).id;<% } %>
const options = {
	rules: {
		<% if (options.jsCompiler === 'ts') { %>js: false,
		ts: true,<% } else { %>js: true,
		ts: false,<% } %>
		scss: <% if (options.themes) { %>{
			implementation: require('node-sass'),
		}<% } else { %>true<% } %>,
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
