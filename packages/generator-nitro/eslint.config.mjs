// eslint.config.mjs
import merkleConfig from '@merkle-open/eslint-config/es2025-node-disable-styles';
import globals from 'globals';

const IgnorePatterns = [
	'**/*.d.ts',
	'node_modules/**',
	'generators/app/templates/**',
];

export default [
	{
		ignores: IgnorePatterns,
	},
	...merkleConfig,
	{
		rules: {
			'complexity': 'off',
			'global-require': 'off',
		},
	},
	{
		files: ['**/*.test.js'],
		languageOptions: {
			globals: globals.mocha,
		}
	},
];
