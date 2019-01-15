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
			additionalRoutes: [
				'api/lottie/shipment.json',
				'api/lottie/bouncing.json',
			],
		},
		copyAssets: [
			// copies all source files to dest folder
			{
				src: '',
				dest: '',
			},
		],
		minifyImages: [
			// copies and minifies all source images to dest folder
			{
				src: 'src/shared/assets/img/**/*',
				dest: 'public/assets/img',
			},
		],
		svgSprites: [
			// generates icon sprite with the name of the last folder in src
			{
				src: 'src/patterns/atoms/icon/img/icons/*.svg',
				dest: 'public/assets/svg',
			},
			{
				src: 'src/patterns/test/ico/img/icos/*.svg',
				dest: 'public/assets/svg',
			},
		],
	},
};

module.exports = config.gulp;
