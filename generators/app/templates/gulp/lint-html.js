'use strict';

const lint = require('../../app/lib/lint');
const config = require('config');
const srcPattern = `${config.get('nitro.tmpDirectory')}/views/*.html`;

module.exports = (gulp, plugins) => {
	return () => {
		return gulp.src(srcPattern)
			.pipe(plugins.htmllint({}, lint.htmllintReporter))
			.on('end', () => {});
	};
};
