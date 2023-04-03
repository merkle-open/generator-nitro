const config = require('config');
const options = {
	rules: {
		js: false,
		ts: true,
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
