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
				src: '<% if (options.exampleCode) { %>src/shared/assets/img/**/*<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/light/img<% } %>',
			},
			{
				src: '<% if (options.exampleCode) { %>src/shared/assets/img/**/*<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/dark/img<% } %>',
			},<% } else { %>
			{
				src: '<% if (options.exampleCode) { %>src/shared/assets/img/**/*<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/img<% } %>',
			},<% } %>
		],
		svgSprites: [
			// generates icon sprite with the name of the last folder in src<% if (options.themes) { %>
			{
				src: '<% if (options.exampleCode) { %>src/patterns/atoms/icon/img/icons/*.svg<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/light/svg<% } %>',
			},
			{
				src: '<% if (options.exampleCode) { %>src/patterns/atoms/icon/img/icons/*.svg<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/dark/svg<% } %>',
			},<% } else { %>
			{
				src: '<% if (options.exampleCode) { %>src/patterns/atoms/icon/img/icons/*.svg<% } %>',
				dest: '<% if (options.exampleCode) { %>public/assets/svg<% } %>',
			},<% } %>
		],
	},
};

module.exports = config.gulp;
