// eslint.config.mjs
import merkleConfig from '@merkle-open/eslint-config/typescript-browser-disable-styles';

const IgnorePatterns = [
	'src/views/**',
	'src/proto.ts',
	'**/*.d.ts',
];

export default [
	{
		ignores: IgnorePatterns,
	},
	...merkleConfig,
	{
		rules: {
			'import-x/no-unresolved': 'off',
			'new-cap': [2, { capIsNew: false }],
			'@typescript-eslint/member-ordering': 'off',
		},
	},
];
