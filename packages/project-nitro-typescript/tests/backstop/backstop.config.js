'use strict';

/**
 * backstop configuration
 * requires a build
 */

const backstopConfig = require('./config/basic');

const scenarios = [
	{
		...backstopConfig.baseScenario,
		label: 'Homepage',
		url: `${backstopConfig.host}/index`,
		removeSelectors: ['.m-example--blue'],
		selectors: ['.m-example'],
		selectorExpansion: true,
	},
];

module.exports = {
	...backstopConfig.baseConfig,
	scenarios,
};
