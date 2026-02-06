'use strict';

const config = require('config');
const ordered = require('ordered-read-streams');
const utils = require('../lib/utils');

async function loadImageminPlugins() {
	const plugins = [];

	try {
		const mozjpeg = (await import('imagemin-mozjpeg')).default;
		plugins.push(mozjpeg({ quality: 75, progressive: true }));
	} catch { /* empty */ }

	try {
		const optipng = (await import('imagemin-optipng')).default;
		plugins.push(optipng({ optimizationLevel: 7 }));
	} catch { /* empty */ }

	try {
		const pngquant = (await import('imagemin-pngquant')).default;
		plugins.push(pngquant());
	} catch { /* empty */ }

	try {
		const svgo = (await import('imagemin-svgo')).default;
		plugins.push(svgo({
			plugins: [
				{ name: 'collapseGroups', active: false },
				// { name: 'cleanupIDs', active: false },
				{ name: 'removeUnknownsAndDefaults', active: false },
				{ name: 'removeViewBox', active: false },
			],
		}));
	} catch { /* empty */ }

	return plugins;
}

module.exports = (gulp, plugins) => {

	return async () => {
		const minifyImagesConfigs = config.has('gulp.minifyImages') ? config.get('gulp.minifyImages') : {};
		const imageminPlugins = await loadImageminPlugins();
		const imagemin = (await import('gulp-imagemin')).default;

		const streams = [];

		utils.each(minifyImagesConfigs, (minifyImagesConfig) => {
			if (minifyImagesConfig && minifyImagesConfig.src && minifyImagesConfig.dest) {
				streams.push(
					gulp
						.src(minifyImagesConfig.src, { encoding: false })
						.pipe(plugins.newer(minifyImagesConfig.dest))
						.pipe(
							imagemin(imageminPlugins)
						)
						.pipe(gulp.dest(minifyImagesConfig.dest))
				);
			}
		});

		return streams.length ? ordered(streams) : Promise.resolve('resolved');
	};
};
