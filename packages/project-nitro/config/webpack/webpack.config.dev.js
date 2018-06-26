const webpackConfig = require('@nitrooo/webpack/webpack-config/webpack.config.dev')({
	rules: {
		ts: false,
		scss: true,
		hbs: true,
		woff: true,
		image: true,
	},
	features: {},
});

module.exports = webpackConfig;
