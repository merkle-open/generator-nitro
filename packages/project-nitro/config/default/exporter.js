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
							from: ' href="\/?([a-z0-9\-]+)"',
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
			views: ['index', 'example-*'],
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
							from: ' href="\/?([a-z0-9\-]+)"',
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
			views: ['index', '404'],
			zip: true,
		},
	],
};

module.exports = config.exporter;
