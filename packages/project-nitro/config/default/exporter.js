'use strict';

/**
 * Nitro Exporter Config
 */

const config = {
	exporter: [
		{
			dest: 'export',
			i18n: ['default', 'dark'],
			publics: ['public/*', 'public/assets/**/*', 'public/notavailable/**/*', 'public/content/**/*'],
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
					glob: ['export/*/css/*.css'],
					replace: [
						{
							from: '/content/',
							to: '../content/',
						},
					],
				},
				{
					glob: ['export/*/js/*.js'],
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
				{
					glob: ['export/*-dark.html'],
					replace: [
						{
							from: ' href="([a-z0-9-]+).html"',
							to: ' href="$1-dark.html"',
						},
						{
							from: 'light/',
							to: 'dark/',
						},
					],
				},
				{
					glob: ['export/index-dark.html'],
					replace: [
						{
							from: '<ul><li><span>Light.*</li></ul>',
							to: '<ul><li><a href="index.html">Light Theme</a></li><li><span>Dark Theme (current)</span></li></ul>',
						},
					],
				},
				{
					glob: ['export/index.html'],
					replace: [
						{
							from: '/theme/dark',
							to: 'index-dark.html',
						},
					],
				},
				{
					glob: ['export/light/js/ui.min.js'],
					replace: [
						{
							from: 'uri:"index"',
							to: 'uri:"index.html"',
						},
					],
				},
				{
					glob: ['export/dark/js/ui.min.js'],
					replace: [
						{
							from: 'uri:"index"',
							to: 'uri:"index-dark.html"',
						},
					],
				},
			],
			views: true,
			additionalRoutes: ['api/lottie/shipment.json', 'api/lottie/bouncing.json'],
			minifyHtml: true,
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
			minifyHtml: false,
			zip: true,
		},
	],
};

module.exports = config.exporter;
