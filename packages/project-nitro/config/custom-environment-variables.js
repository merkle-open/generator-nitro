'use strict';

/**
 * Config - Custom Environment Variables
 * https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables
 */

const config = {
	server: {
		port: 'PORT',
		hmrPort: 'HMR_PORT',
	},
};

module.exports = config;
