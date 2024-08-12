'use strict';

const config = require('config');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	/* eslint-disable complexity */
	return () => {
		const minifyImagesConfigs = config.has('gulp.minifyImages') ? config.get('gulp.minifyImages') : {};
		const streams = [];

		const imageminMozjpeg = utils.getOptionalPackage('imagemin-mozjpeg');
		const imageminOptipng = utils.getOptionalPackage('imagemin-optipng');
		const imageminPngquant = utils.getOptionalPackage('imagemin-pngquant');
		const imageminSvgo = utils.getOptionalPackage('imagemin-svgo');
		const imageminPluginsConfig = [];

		// console.log('imagemin-mozjpeg: ', imageminMozjpeg ? 'installed' : 'NOT');
		// console.log('imagemin-optipng: ', imageminOptipng ? 'installed' : 'NOT');
		// console.log('imagemin-pngquant: ', imageminPngquant ? 'installed' : 'NOT');
		// console.log('imagemin-svgo: ', imageminSvgo ? 'installed' : 'NOT');

		if (imageminMozjpeg) {
			imageminPluginsConfig.push(
				plugins.imagemin.mozjpeg({ quality: 75, progressive: true })
			);
		}
		if (imageminOptipng) {
			imageminPluginsConfig.push(
				plugins.imagemin.optipng({ optimizationLevel: 7 })
			);
		}
		if (imageminSvgo) {
			imageminPluginsConfig.push(
				plugins.imagemin.svgo({
					plugins: [
						{ collapseGroups: false },
						{ cleanupIDs: false },
						{ removeUnknownsAndDefaults: false },
						{ removeViewBox: false },
					],
				})
			);
		}
		if (imageminPngquant) {
			imageminPluginsConfig.push(
				imageminPngquant()
			);
		}

		utils.each(minifyImagesConfigs, (minifyImagesConfig) => {
			if (minifyImagesConfig && minifyImagesConfig.src && minifyImagesConfig.dest) {
				streams.push(
					gulp
						.src(minifyImagesConfig.src, { encoding: false })
						.pipe(plugins.newer(minifyImagesConfig.dest))
						.pipe(
							plugins.imagemin(imageminPluginsConfig)
						)
						.pipe(gulp.dest(minifyImagesConfig.dest))
				);
			}
		});

		return streams.length ? merge(...streams) : Promise.resolve('resolved');
	};
	/* eslint-enable complexity */
};
