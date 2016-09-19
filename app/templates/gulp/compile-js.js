'use strict';

const utils = require('./utils');
const Promise = require('es6-promise').Promise;

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('js');
		const browserSync = utils.getBrowserSyncInstance();
		let promises = [];

		assets.forEach((asset) => {
			<% if (options.js === 'TypeScript') { %>
				let tsAssets = utils.splitJsAssets(asset);
				tsAssets.js.push('public/assets/js/' + asset.name.replace('.js', '.ts.js'));
			<% } %>
			promises.push(new Promise((resolve) => {
				gulp.src(<% if (options.js === 'TypeScript') { %>tsAssets.js<% } else { %>asset.src<% } %>, {base: '.'})
					.pipe(plugins.plumber())
					.pipe(plugins.cached(asset.name))
					.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.eslint())
					.pipe(plugins.eslint.format())
					.pipe(plugins.babel({presets: ['es2015'], ignore: ['node_modules'<% if (options.clientTpl) { %>, 'patterns/**/template/*.js', 'patterns/**/template/partial/*.js'<% } %>]}))
					.pipe(plugins.remember(asset.name))
					.pipe(plugins.concat(asset.name))
					.pipe(plugins.sourcemaps.write('.'))
					.pipe(gulp.dest('public/assets/js'))
					.on('end', () => {
						resolve();
					})
					.pipe(browserSync.stream());
			}));
		});

		return Promise.all(promises);
	};
};
