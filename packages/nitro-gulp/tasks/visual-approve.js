'use strict';

/**
 * approve backstopjs tests
 */

const backstop = require('backstopjs');
const projectPath = require('../lib/utils').getProjectPath();

module.exports = () => {
	return () => {
		return backstop('approve', {
			config: require(`${projectPath}tests/backstop/backstop.config.js`)({}),
		});
	};
};
