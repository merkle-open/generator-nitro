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
		},
	},
];
