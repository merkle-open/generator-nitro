'use strict';

const utils = require('./utils');
const Promise = require('es6-promise').Promise;

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('js');

		const tsDefinition = {
			typescript: require('typescript'),
			declarationFiles: false,
			removeComments: true,
			target: 'ES5'
		};

		let promises = [];

		assets.forEach((asset) => {
			const assets = utils.splitJsAssets(asset);

			promises.push(new Promise((resolve) => {
				gulp.src(assets.ts)
					.pipe(plugins.plumber())
					.pipe(plugins.typescript(tsDefinition))
					.js
					.pipe(plugins.concat(asset.name.replace('.js', '.ts.js')))
					.pipe(gulp.dest('public/assets/js'))
					.on('end', () => {
						resolve();
					});
			}));
		});

		return Promise.all(promises);
	};
};

