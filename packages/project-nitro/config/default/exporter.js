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
			views: ['index', 'example-*'],
			additionalRoutes: ['api/lottie/shipment.json', 'api/lottie/bouncing.json'],
			zip: false,
		},
		{
			dest: 'target',
			i18n: [],
			publics: ['public/*', 'public/assets/**/*', 'public/content/**/*'],
			renames: [],
			replacements: [
				{
					glob: ['target/*.html'],
					replace: [
						{
							from: '/assets/',
							to: 'assets/',
						},
						{
							from: '/content/',
							to: 'content/',
						},
						{
							from: 'example-patterns',
							to: '404',
						},
						{
							from: ' href="/?([a-z0-9-]+)"',
							to: ' href="$1.html"',
						},
					],
				},
				{
					glob: ['target/assets/css/*.css'],
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
					glob: ['target/assets/js/*.js'],
					replace: [
						{
							from: '/assets/',
							to: 'assets/',
						},
						{
							from: '/api',
							to: 'api',
						},
					],
				},
			],
			views: true,
			additionalRoutes: [],
			zip: true,
		},
	],
};

module.exports = config.exporter;
