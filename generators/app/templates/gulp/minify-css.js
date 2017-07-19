'use strict';

const utils = require('./utils');
const Promise = require('es6-promise').Promise;

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('css');
		const promises = [];

		assets.forEach((asset) => {
			promises.push(new Promise((resolve) => {
				gulp
					.src(`public/assets/css/${asset.name}`)
					.pipe(plugins.cssnano({
						mergeRules: false,
						safe: true,
					}))
					.pipe(plugins.rename(asset.name.replace('.css', '.min.css')))
					.pipe(plugins.size({ showFiles: true, gzip: false, title: 'CSS minified' }))
					.pipe(plugins.size({ showFiles: true, gzip: true, title: 'CSS minified' }))
					.pipe(gulp.dest('public/assets/css/'))
					.on('end', () => {
						resolve();
					});
			}));
		});

		return Promise.all(promises);
	};
};
