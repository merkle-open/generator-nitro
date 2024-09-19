'use strict';

const path = require('path');
const config = require('config');
const ordered = require('ordered-read-streams');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {
		const streams = [];
		const svgSpritesConfigs = config.has('gulp.svgSprites') ? config.get('gulp.svgSprites') : {};

		utils.each(svgSpritesConfigs, (svgSpritesConfig) => {
			if (svgSpritesConfig && svgSpritesConfig.src && svgSpritesConfig.dest) {
				streams.push(
					gulp
						.src(svgSpritesConfig.src)
						.pipe(
							plugins.svgmin((file) => {
								const prefix = path.basename(file.relative, path.extname(file.relative));
								return {
									multipass: true,
									plugins: [
										{ removeViewBox: false },
										{
											name: 'cleanupIDs',
											parmas: {
												prefix: `${prefix}-`,
												minify: true,
											},
										},
									],
								};
							})
						)
						.pipe(plugins.svgstore({ inlineSvg: true }))
						.pipe(gulp.dest(svgSpritesConfig.dest))
				);
			}
		});

		return streams.length ? ordered(streams) : Promise.resolve('resolved');
	};
};
