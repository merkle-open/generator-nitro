module.exports = {
	extends: [
		'@merkle-open/eslint-config/configurations/es8-node.js',
		'@merkle-open/eslint-config/configurations/es8-node-disable-styles.js',
	].map(require.resolve),
	rules: {
		complexity: 'off',
		'global-require': 'off',
		'new-cap': 'off',
		'no-console': 'off',
		'no-bitwise': 'off',
		'no-inline-comments': 'off',
		'no-implicit-coercion': 'off',
		'prefer-rest-params': 'off',
		'require-jsdoc': 'off',
		'valid-jsdoc': 'off',
	},
};
