module.exports = {
	extends: [
		'@merkle-open/eslint-config/configurations/es8-node.js',
		'@merkle-open/eslint-config/configurations/es8-node-disable-styles.js',
	].map(require.resolve),
	rules: {
		complexity: 'off',
		'global-require': 'off',
		'require-jsdoc': 'off',
	},
};
