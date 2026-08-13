// eslint.config.mjs
import merkleConfig from '@merkle-open/eslint-config/es2025-node-disable-styles';

const IgnorePatterns = [
	'**/*.d.ts',
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
			'new-cap': [2, { capIsNew: false }],
			'no-bitwise': 'off',
			'no-console': 'off',
			'no-implicit-coercion': 'off',
			'prefer-rest-params': 'off',
		},
	},
];
