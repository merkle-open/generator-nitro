const config = {
	'root': true,
	'extends': [
		'html-validate:recommended',
	],
	'rules': {
		'element-required-attributes': 'warn',
		'no-inline-style': 'off',
		'no-raw-characters': [
			'warn', { 'relaxed': true },
		],
		'prefer-native-element': 'warn',
		'svg-focusable': 'off',

		// disable style rules
		'no-trailing-whitespace': 'off',
	},
}

module.exports = config;
