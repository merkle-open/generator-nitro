'use strict';

const config = {
	nitro: {
		patterns: {
			atom: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/atoms',
				patternPrefix: 'a',
			},
			molecule: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/molecules',
				patternPrefix: 'm',
			},
			organism: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/organisms',
				patternPrefix: 'o',
			},
		},
	},
};

module.exports = config.nitro.patterns;
