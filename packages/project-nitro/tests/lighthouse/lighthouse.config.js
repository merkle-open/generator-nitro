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
			'document-latency-insight',
			'modern-http-insight',
			'redirects',
			'redirects-http',
			'server-response-time',
			'use-cache-insight',
			// best-practices
			'csp-xss',
			'is-on-https',
			'redirects-http',
			// seo
			'document-title',
			'http-status-code',
			'is-crawlable',
			'meta-description',
			'robots-txt',
		],
	},
};
