'use strict';

/**
 * Nitro Exporter Config
 * https://github.com/namics/nitro-exporter
 */

const config = {
	exporter: [
		{
			dest: 'dist',
			i18n: [],
			publics: ['public/*', 'public/assets/**/*', 'public/content/**/*'],
			renames: [
				{
					src: 'dist/assets/**',
					base: 'dist/assets',
					dest: 'dist/',
				},
			],
			replacements: [
				{
					glob: ['dist/*.html'],
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
					glob: ['dist/css/*.css'],
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
					glob: ['dist/js/*.js'],
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
			zip: false,
		},
	],
};

module.exports = config.exporter;
