'use strict';

const config = require('config');

const backstopConfig = require('./basic');
const pkg = require('../../../package.json');

const getBaseConfig = () => {
	return backstopConfig.baseConfig;
};

const getBaseScenario = () => {
	return backstopConfig.baseScenario;
};

const createScenarios = (scenarios) => {
	// this default will take screenshots from all configured themes
	const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : [{id: 'default', name: pkg.name, isDefault: true}];

	return validThemes.flatMap((theme) => {
		return scenarios.map((scenario) => {
			return {
				...scenario,
				label: `${theme.name} ${scenario.label}`,
				url: theme.isDefault ? `${backstopConfig.host}/${scenario.url}` : `${backstopConfig.host}/theme/${theme.id}?ref=/${scenario.url}`,
			};
		});
	});
};

const getFinalScenarios = (scenarios) => {
	return createScenarios(scenarios);
};

module.exports = {
	getBaseConfig,
	getBaseScenario,
	getFinalScenarios,
};
