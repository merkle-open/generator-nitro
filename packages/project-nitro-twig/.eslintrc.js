module.exports = {
	extends: [
		'@merkle-open/eslint-config/configurations/es8-browser.js',
		'@merkle-open/eslint-config/configurations/es8-browser-disable-styles.js',
	].map(require.resolve),
	rules: {
		'new-cap': [2, { capIsNew: false }],
		'require-jsdoc': 'off',
	},
	parser: '@babel/eslint-parser',
};
