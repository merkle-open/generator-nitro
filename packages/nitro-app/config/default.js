const baseConfig = require('../app/core/config');

// add required pattern configuration
baseConfig.nitro.patterns = {
	atom: {
		template: 'project/blueprints/pattern',
		path: 'project/fixtures/atoms',
		patternPrefix: 'a',
	},
	molecule: {
		template: 'project/blueprints/pattern',
		path: 'project/fixtures/molecules',
		patternPrefix: 'm',
	},
	organism: {
		template: 'project/blueprints/pattern',
		path: 'project/fixtures/organisms',
		patternPrefix: 'mo',
	},
};

// change view path
baseConfig.nitro.viewDirectory = 'project/views';

module.exports = baseConfig;
