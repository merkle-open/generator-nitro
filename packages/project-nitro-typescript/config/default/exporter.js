'use strict';

/**
 * Nitro Exporter Config
 */

const config = {
	exporter: [
		{
			dest: 'export',
			i18n: [],
			publics: ['public/*', 'public/assets/**/*', 'public/content/**/*'],
			renames: [
				{
					src: 'export/assets/**',
					base: 'export/assets',
					dest: 'export/',
				},
			],
			replacements: [
				{
					glob: ['export/*.html'],
					replace: [
						{
							from: '/assets/',
							to: '',
						},
						{
							from: '/content/',
							to: 'content/',
						},
						{
							from: ' href="/?([a-z0-9-]+)"',
							to: ' href="$1.html"',
						},
					],
				},
				{
					glob: ['export/css/*.css'],
					replace: [
						{
							from: '/assets/',
							to: '../',
						},
						{
							from: '/content/',
							to: '../content/',
						},
					],
				},
				{
					glob: ['export/js/*.js'],
					replace: [
						{
							from: '/assets/',
							to: '',
						},
						{
							from: '/api',
							to: 'api',
						},
					],
				},
			],
			views: true,
			additionalRoutes: ['api/lottie/shipment.json', 'api/lottie/bouncing.json'],
			minifyHtml: true,
			zip: false,
		},
	],
};

module.exports = config.exporter;
