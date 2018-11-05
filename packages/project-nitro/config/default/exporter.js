'use strict';

/**
 * Nitro Exporter Config
 * https://github.com/namics/nitro-exporter
 */

const config = {
	exporter: {
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
						from: '/api',
						to: 'api',
					},
				],
			},
		],
		views: true,
		zip: false,
	},
};

module.exports = config.exporter;
