const webpackConfig = require('@nitrooo/webpack/webpack-config/webpack.config.prod')({
	rules: {
		ts: false,
		scss: true,
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
		gitInfo: false,
	},
});

module.exports = webpackConfig;
