'use strict';

// add optional include or exclude configs to rule
function getEnrichedConfig(rule, config) {
	if (!config) {
		return rule;
	}

	if (config.include) {
		rule.include = config.include;
	}
	if (config.exclude) {
		rule.exclude = config.exclude;
	}
	return rule;
}

// load optional package
function getOptionalPackage(x) {
	let mod;
	try {
		mod = require(x);
	} catch (error) {
		mod = null;
	}
	return mod;
}

module.exports = {
	getEnrichedConfig,
	getOptionalPackage,
};
