// eslint.config.mjs
<% if (options.jsCompiler === 'ts') { %>import merkleConfig from '@merkle-open/eslint-config/typescript-browser-disable-styles';

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
];<% } else { %>import merkleConfig from '@merkle-open/eslint-config/es2025-browser-disable-styles';
import babelParser from '@babel/eslint-parser';

const IgnorePatterns = [
	'**/*.d.ts',
	'*.js',
	'config/**',
	'project/**',
	'public/**',
	'tests/**',
	'src/proto.js',
	'src/views/**',
];

export default [
	{
		ignores: IgnorePatterns,
	},
	...merkleConfig,
	{
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: true,
			},
		},
		rules: {
			'new-cap': [2, { capIsNew: false }],
		},
	},
];<% } %>
