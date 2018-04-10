'use strict';

/**
 * Simple solution
 * if you need more control, start the server with pm2 or similar techniques
 * https://github.com/namics/generator-nitro/blob/master/app/templates/project/docs/nitro.md#starting-the-app
 * https://www.npmjs.com/package/pm2
 */

module.exports = (gulp, plugins) => {
	return () => {
		return gulp.start('serve');
	};
};
