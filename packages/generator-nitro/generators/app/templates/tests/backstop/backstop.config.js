'use strict';

/**
 * backstop configuration
 * requires a build
 */

const utils = require('./config/utils');

const baseScenario = utils.getBaseScenario();

const scenarios = [
	{
		...baseScenario,
		label: 'Example',
		url: 'index',
		removeSelectors: ['.m-example--blue'],
		selectors: ['.m-example'],
		selectorExpansion: true,
	},
];

module.exports = {
	...utils.getBaseConfig(),
	scenarios: utils.getFinalScenarios(scenarios),
};
