'use strict';

const utils = require('./utils');
const Promise = require('es6-promise').Promise;
const uglifyOptions = {
	output: {
		comments: /^!/,
	},
};

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('js');
		const promises = [];

		assets.forEach((asset) => {
			promises.push(new Promise((resolve) => {
				gulp
					.src(`public/assets/js/${asset.name}`)
					.pipe(plugins.uglify(uglifyOptions))
					.pipe(plugins.rename(asset.name.replace('.js', '.min.js')))
					.pipe(plugins.size({ showFiles: true, gzip: false, title: 'JavaScript minified' }))
					.pipe(plugins.size({ showFiles: true, gzip: true, title: 'JavaScript minified' }))
					.pipe(gulp.dest('public/assets/js/'))
					.on('end', () => {
						resolve();
					});
			}));
		});

		return Promise.all(promises);
	};
};
