const baseConfig = require('../app/core/config');

// add required pattern configuration
baseConfig.nitro.patterns = {
	atom: {
		template: 'project/blueprints/pattern',
		path: 'project/fixtures',
		patternPrefix: 'a',
	},
};

// change view path
baseConfig.nitro.viewDirectory = 'project/views';

module.exports = baseConfig;
