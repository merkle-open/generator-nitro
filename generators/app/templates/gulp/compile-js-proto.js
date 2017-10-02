'use strict';

const utils = require('./utils');
const config = require('config');
const lintJs = Boolean(config.get('code.validation.eslint.live'));
const jsFiles = [
	'src/proto/js/*.js',
	'src/patterns/**/proto/**/*.js',
];
const assetName = 'prototype.js';

module.exports = (gulp, plugins) => {
	return () => {

		const browserSync = utils.getBrowserSyncInstance();

		return gulp.src(jsFiles, {base: '.'})
			.pipe(plugins.plumber())
			.pipe(plugins.cached(assetName))
			.pipe(plugins.if(lintJs, plugins.eslint()))
			.pipe(plugins.if(lintJs, plugins.eslint.format()))
			.pipe(plugins.babel({presets: ['env'], ignore: ['node_modules']}))
			.pipe(plugins.remember(assetName))
			.pipe(plugins.concat(assetName))
			.pipe(plugins.plumber.stop())
			.pipe(gulp.dest('public/proto/js/'))
			.on('end', () => {
				if (config.get('nitro.mode.livereload')) {
					browserSync.reload('*.js');
				}
			})
	};
};
