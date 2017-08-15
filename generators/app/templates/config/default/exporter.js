'use strict';

/**
 * Nitro Exporter Config
 * https://github.com/namics/nitro-exporter
 */

const config = {
	exporter: {
		dest: 'dist',
		i18n: [],
		publics: true,
		renames: [
			{
				src: 'dist/assets/**',
				base: 'dist/assets',
				dest: 'dist/',
			},
		],
		replacements: [
			{
				glob: ['dist/*.html', 'dist/css/*.css'],
				replace: [
					{
						from: '/assets/',
						to: '',
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
			{
				glob: ['dist/*.html'],
				replace: [
					{
						from: '([a-z]+)\\.(css|js)',
						to: '$1.min.$2',
					},
				],
			},
		],
		views: true,
		zip: false,
	},
};

module.exports = config.exporter;
