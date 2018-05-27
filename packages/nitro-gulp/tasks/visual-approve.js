'use strict';

/**
 * approve backstopjs tests
 */

const backstop = require('backstopjs');
const projectPath = require('../utils/utils').getProjectPath();
const backstopConfig = require(`${projectPath}tests/backstop/backstop.config.js`)({});

module.exports = () => {
	return () => {
		return backstop('approve', {
			backstopConfig,
		});
	};
};
