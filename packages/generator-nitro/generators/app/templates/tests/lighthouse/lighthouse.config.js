'use strict';

/**
 * lighthouse configuration
 * test requires a build
 */

module.exports = {
	extends: 'lighthouse:default',
	settings: {
		// https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
		onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
		skipAudits: [
			// performance
			'redirects',
			'server-response-time',
			'uses-http2',
			'uses-long-cache-ttl',
			// best-practices
			'appcache-manifest',
			'is-on-https',
			// seo
			'http-status-code',
			'is-crawlable',
			'robots-txt',
		],
	},
};
