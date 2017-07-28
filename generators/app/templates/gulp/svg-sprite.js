'use strict';

const path = require('path');
const merge = require('merge-stream');

module.exports = (gulp, plugins) => {
	return () => {
		const svgIcons = gulp
			.src('patterns/atoms/icon/img/icons/*.svg')
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
			.pipe(gulp.dest('public/assets/svg'));

		// or return merge(svgIcons, otherStream);
		return svgIcons;
	};
};
