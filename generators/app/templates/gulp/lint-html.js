'use strict';

const utils = require('./utils');
const lint = require('../app/lib/lint');
const srcPattern = `${utils.getTmpDirectory('views')}/*.html`;

module.exports = (gulp, plugins) => {
	return () => {
		return gulp.src(srcPattern)
			.pipe(plugins.htmllint({}, lint.htmllintReporter))
			.on('end', () => {});
	};
};
