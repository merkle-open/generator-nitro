'use strict';

// add optional include or exclude configs to rule
function getEnrichedConfig(rule, config) {
	if (!config) { return rule; }

	if (config.include) {
		rule.include = config.include;
	}
	if (config.exclude) {
		rule.exclude = config.exclude;
	}
	return rule;
}

module.exports = {
	getEnrichedConfig,
};
