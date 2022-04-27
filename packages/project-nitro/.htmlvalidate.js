const config = {
	root: true,
	extends: ['html-validate:recommended'],
	rules: {
		'element-required-attributes': 'warn',
		'element-permitted-order': 'warn',
		'no-inline-style': 'off',
		'no-implicit-close': 'warn',
		'no-raw-characters': ['warn', { relaxed: true }],
		'prefer-native-element': 'warn',
		'svg-focusable': 'off',
		'tel-non-breaking': 'off',

		// disable style rules
		'no-trailing-whitespace': 'off',
	},
};

module.exports = config;
