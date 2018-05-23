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
		svgSprite: {
			// generates icon sprite with the name of the last folder in src
			// src: 'src/patterns/atoms/icon/img/icons/*.svg',
			// dest: 'public/assets/svg',
		},
		minifyImg: {
			// copies and minifies all source images to dest folder
			// src: 'src/shared/assets/img/**/*',
			// dest: 'public/assets/img',
		},
	},
};

module.exports = config.gulp;
