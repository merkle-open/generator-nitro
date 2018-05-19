'use strict';

/**
 * Nitro Gulp Config
 */

const config = {
	gulp: {
		dumpViews: {
			// filter corrupt, incomplete or irrelevant views
			// example:
			// viewFilter: (url) => url !== 'incomplete',
		},
		svgSprite: {
			// generates icon sprite with the name of the last folder in src
			// default:
			// src: 'src/patterns/atoms/icon/img/icons/*.svg',
			// dest: 'public/assets/svg',
		},
		minifyImg: {
			// copies and minifies all source images to dest folder
			// default:
			// src: 'src/assets/img/**/*',
			// dest: 'public/assets/img',
		},
		copyAssets: {
			// copies all sources to dest folder
			// default
			// src: 'src/assets/font/**/*.*',
			// dest: 'public/assets/font',
		},
	},
};

module.exports = config.gulp;
