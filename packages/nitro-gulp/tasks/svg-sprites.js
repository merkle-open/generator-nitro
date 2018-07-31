'use strict';

const path = require('path');
const config = require('config');
const merge = require('merge-stream');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const svgSpritesConfigs = config.has('gulp.svgSprites') ? config.get('gulp.svgSprites') : {};
		let stream = utils.getEmptyStream();

		utils.each(svgSpritesConfigs, (svgSpritesConfig) => {
			let spriteStream;

			if (svgSpritesConfig && svgSpritesConfig.src && svgSpritesConfig.dest) {
				spriteStream = gulp
					.src(svgSpritesConfig.src)
					.pipe(plugins.svgmin((file) => {
						const prefix = path.basename(file.relative, path.extname(file.relative));
						return {
							plugins: [
								{
									removeDoctype: true,
								}, {
									cleanupIDs: {
										prefix: `${prefix}-`,
										minify: true,
									},
								},
							],
						};
					}))
					.pipe(plugins.svgstore({inlineSvg: true}))
					.pipe(gulp.dest(svgSpritesConfig.dest));
			} else {
				spriteStream = utils.getEmptyStream();
			}

			stream = merge(stream, spriteStream);
		});

		return stream;
	};
};
