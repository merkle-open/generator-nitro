// eslint.config.mjs
import merkleConfig from '@merkle-open/eslint-config/es2025-browser-disable-styles';
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
];
