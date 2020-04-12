'use strict';

/**
 * Nitro gulp config
 */

const config = {
	gulp: {
		dumpViews: {
			// filter corrupt, incomplete or irrelevant views
			// example:
			// viewFilter: (url) => url !== 'incomplete',
		},
		copyAssets: [
			// copies all source files to dest folder
			{
				src: '',
				dest: '',
			},
		],
		minifyImages: [
			// copies and minifies all source images to dest folder<% if (options.themes) { %>
			{
				src: 'src/shared/assets/img/**/*',
				dest: 'public/assets/light/img',
			},
			{
				src: 'src/shared/assets/img/**/*',
				dest: 'public/assets/dark/img',
			},<% } else { %>
			{
				src: 'src/shared/assets/img/**/*',
				dest: 'public/assets/img',
			},<% } %>
		],
		svgSprites: [
			// generates icon sprite with the name of the last folder in src<% if (options.themes) { %>
			{
				src: 'src/patterns/atoms/icon/img/icons/*.svg',
				dest: 'public/assets/light/svg',
			},
			{
				src: 'src/patterns/atoms/icon/img/icons/*.svg',
				dest: 'public/assets/dark/svg',
			},<% } else { %>
			{
				src: 'src/patterns/atoms/icon/img/icons/*.svg',
				dest: 'public/assets/svg',
			},<% } %>
		],
	},
};

module.exports = config.gulp;
