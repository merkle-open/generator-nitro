module.exports = {
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	trailingComma: 'es5',
	bracketSpacing: true,
	jsxBracketSameLine: false,
	arrowParens: 'always',
	parser: 'typescript',
	overrides: [
		{
			files: ['*.json', '.*.json'],
			options: {
				parser: 'json',
			},
		},
		{
			files: ['*.(js|jsx)', '.*.(js|jsx)'],
			options: {
				parser: 'babylon',
			},
		},
	],
};
