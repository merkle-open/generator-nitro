// @ts-check

module.exports = {
	extends: [
		'@namics/eslint-config/configurations/typescript-browser.js',
		'@namics/eslint-config/configurations/typescript-browser-disable-styles.js',
	].map(require.resolve),
	rules: {
		'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
		'new-cap': [2, { capIsNew: false }],
		'@typescript-eslint/member-naming': false,
	},
	parserOptions: {
		project: './tsconfig.json',
	},
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
