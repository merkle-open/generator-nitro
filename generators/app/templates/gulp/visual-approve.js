'use strict';

/**
 * approve backstopjs tests
 */

const backstop = require('backstopjs');
const config = require('../tests/backstop/backstop.config.js')({});

module.exports = (gulp, plugins) => {
	return () => {
		return backstop('approve', {
			config
		});
	};
};
