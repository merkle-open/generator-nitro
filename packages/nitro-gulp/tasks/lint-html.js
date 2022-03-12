'use strict';

const config = require('config');
const srcPattern = `${config.get('nitro.tmpDirectory')}/views/*.html`;

module.exports = (gulp, plugins) => {
	return () => {
		return gulp
			.src(srcPattern)
			.pipe(plugins.htmlValidate())
			.pipe(plugins.htmlValidate.format())
			.pipe(plugins.htmlValidate.failAfterError())
			.on('end', () => {});
	};
};
