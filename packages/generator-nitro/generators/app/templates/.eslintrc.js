module.exports = {
	extends: [
		'@namics/eslint-config/configurations/es8-browser.js',
		'@namics/eslint-config/configurations/es8-browser-disable-styles.js',
	].map(require.resolve),
	rules: {
		'require-jsdoc': 'off',
		'new-cap': [2, { capIsNew: false }],
	},
	parser: 'babel-eslint',
};
