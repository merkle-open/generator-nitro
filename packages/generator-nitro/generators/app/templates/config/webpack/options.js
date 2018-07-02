const options = {
	rules: {
		ts: false,
		scss: true,
		hbs: <% if (options.clientTpl) { %>true<% } else { %>false<% } %>,
		woff: true,
		image: true,
	},
	features: {
		gitInfo: false,
	},
};

module.exports = options;
