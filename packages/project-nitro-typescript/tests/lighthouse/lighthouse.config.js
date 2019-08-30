'use strict';

/**
 * lighthouse configuration
 * test requires a build
 */

module.exports = {
	extends: 'lighthouse:default',
	settings: {
		// https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js
		onlyCategories: [
			'performance',
			'accessibility',
			'best-practices',
			'seo'
		],
		skipAudits: [
			// best-practices
			'appcache-manifest',
			'is-on-https',
			'uses-http2',
			// seo
			'is-crawlable',
		],
	},
};
