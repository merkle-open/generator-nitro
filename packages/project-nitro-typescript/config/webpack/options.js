const options = {
	rules: {
		script: {
			typescript: true,
		},
		style: {
			sassOptions: {
				quietDeps: true,
				// color-function and import are muted due to issues in twitter bootstrap scss
				silenceDeprecations: ['color-functions', 'import'],
			},
		},
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
		imageMinimizer: true,
	},
};

module.exports = options;
