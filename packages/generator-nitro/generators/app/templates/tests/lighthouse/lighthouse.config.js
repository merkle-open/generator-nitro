'use strict';

/**
 * lighthouse configuration
 * test requires a build
 */

module.exports = {
	extends: 'lighthouse:default',
	settings: {
		// https://github.com/GoogleChrome/lighthouse/blob/v6.0.0-beta.0/lighthouse-core/config/default-config.js
		onlyCategories: [
			'performance',
			'accessibility',
			'best-practices',
			'seo'
		],
		skipAudits: [
			// performance
			'time-to-first-byte',
			// best-practices
			'appcache-manifest',
			'is-on-https',
			'uses-http2',
			// seo
			'is-crawlable',
		],
	},
};
