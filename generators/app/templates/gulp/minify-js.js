'use strict';

const utils = require('./utils');

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('js');

		assets.forEach((asset) => {
			gulp
				.src(`public/assets/js/${asset.name}`)
				.pipe(plugins.uglify({preserveComments: 'license'}))
				.pipe(plugins.rename(asset.name.replace('.js', '.min.js')))
				.pipe(plugins.size({showFiles: true, gzip: false, title: 'JavaScript minified'}))
				.pipe(plugins.size({showFiles: true, gzip: true, title: 'JavaScript minified'}))
				.pipe(gulp.dest('public/assets/js/'));
		});

		return gulp;
	};
};

