'use strict';

const path = require('path');
const config = require('config');

module.exports = (gulp, plugins) => {
	return () => {
		const svgIcons = gulp
			.src(config.get('gulp.svgSprite.src'))
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
			.pipe(plugins.svgstore({ inlineSvg: true }))
			.pipe(gulp.dest(config.get('gulp.svgSprite.dest')));

		return svgIcons;
	};
};
