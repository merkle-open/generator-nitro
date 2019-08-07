const config = require('@namics/prettier-config');

config.overrides.push(
	{
		files: ['*.md'],
		options: {
			parser: 'markdown',
		},
	},
);

module.exports = config;
