const config = require('config');
const options = {
	rules: {
		js: true,
		ts: false,
		scss: true,
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
	},
};

module.exports = options;
