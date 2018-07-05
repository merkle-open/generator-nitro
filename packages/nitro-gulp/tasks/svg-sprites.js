'use strict';

const path = require('path');
const config = require('config');
const utils = require('../lib/utils');

module.exports = (gulp, plugins) => {
	return () => {

		const svgSpritesConfig = config.has('gulp.svgSprites') ? config.get('gulp.svgSprites') : {};
		let stream;

		if (svgSpritesConfig && svgSpritesConfig.src && svgSpritesConfig.dest) {
			stream = gulp
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
			stream = utils.getEmptyStream();
		}

		return stream;
	};
};
