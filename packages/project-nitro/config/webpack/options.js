const config = require('config');
const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;
const theme = process.env.THEME ? process.env.THEME : validThemes.find((theme) => theme.isDefault).id;
const options = {
	rules: {
		js: true,
		ts: false,
		scss: {
			publicPath: '../',
			implementation: require('node-sass'),
		},
		hbs: true,
		woff: {
			exclude: [/slick-carousel/],
		},
		// ⚠ use font rule with care - processes also svg and woff files
		// ⚠ use includes and excludes also in 'image' and 'woff' loader config
		font: {
			include: [/slick-carousel/],
		},
		image: {
			exclude: [/slick-carousel.*\.svg/],
		},
	},
	features: {
		banner: true,
		bundleAnalyzer: false,
		theme: theme,
		dynamicAlias: {
			search: '/theme/light',
			replace: `/theme/${theme}`,
		},
	},
};

module.exports = options;
