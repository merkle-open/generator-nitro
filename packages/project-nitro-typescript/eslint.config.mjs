// eslint.config.mjs
import merkleConfig from '@merkle-open/eslint-config/typescript-browser-disable-styles';

const IgnorePatterns = [
	'**/*.d.ts',
	'*.js',
	'config/**',
	'project/**',
	'public/**',
	'tests/**',
	'src/proto.ts',
	'src/views/**',
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
