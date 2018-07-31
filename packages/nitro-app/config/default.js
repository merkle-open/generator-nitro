const baseConfig = require('../app/core/config');

// add required pattern configuration
baseConfig.nitro.patterns = {
	atom: {
		template: 'project/blueprints/pattern',
		path: 'project/fixtures',
		patternPrefix: 'a',
	},
};

module.exports = baseConfig;
