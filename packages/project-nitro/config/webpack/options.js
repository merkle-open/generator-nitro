const config = require('config');
const options = {
	rules: {
		js: {
			eslint: config.get('code.validation.eslint.live'),
		},
		ts: false,
		scss: {
			stylelint: config.get('code.validation.stylelint.live'),
		},
		hbs: true,
		woff: {
			exclude: [ /slick-carousel/ ],
		},
		// ⚠ use font rule with care - processes also svg and woff files
		// ⚠ use includes and excludes also in 'image' and 'woff' loader config
		font: {
			include: [ /slick-carousel/ ],
		},
		image: {
			exclude: [ /slick-carousel.*\.svg/ ],
		},
	},
	features: {
		bundleAnalyzer: false,
		gitInfo: false,
	},
};

module.exports = options;
