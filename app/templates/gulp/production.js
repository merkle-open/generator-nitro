/*
 Simple solution
 if you need more control, start the server with forever or similar techniques
 https://github.com/namics/generator-nitro/blob/master/app/templates/project/docs/nitro.md#starting-the-app
 https://www.npmjs.com/package/forever
*/
module.exports = function (gulp, plugins) {
	return function () {
		gulp.start('serve');
	};
};
