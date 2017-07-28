'use strict';

const utils = require('./utils');
const Promise = require('es6-promise').Promise;
const config = require('config');
const lintJs = Boolean(config.get('code.validation.eslint.live'));
const bannerData = {
	date: new Date().toISOString().slice(0, 19),
	pkg: require('../package.json'),
};
const banner = ['/*! ',
	' * <%%= bannerData.pkg.name %>',
	' * @version v<%%= bannerData.pkg.version %>',
	' * @date <%%= bannerData.date %>',
	' */',
	''].join('\n');

module.exports = (gulp, plugins) => {
	return () => {
		const assets = utils.getSourcePatterns('js');
		const browserSync = utils.getBrowserSyncInstance();
		const promises = [];

		assets.forEach((asset) => {<% if (options.js === 'TypeScript') { %>
				let tsAssets = utils.splitJsAssets(asset);
				tsAssets.js.push('public/assets/js/' + asset.name.replace('.js', '.ts.js'));
			<% } %>
			promises.push(new Promise((resolve) => {
				gulp.src(<% if (options.js === 'TypeScript') { %>tsAssets.js<% } else { %>asset.src<% } %>, { base: '.' })
					.pipe(plugins.plumber())
					.pipe(plugins.cached(asset.name))
					.pipe(plugins.sourcemaps.init({ loadMaps: true }))
					.pipe(plugins.if(lintJs, plugins.eslint()))
					.pipe(plugins.if(lintJs, plugins.eslint.format()))
					.pipe(plugins.babel({ presets: ['es2015'], ignore: ['node_modules'<% if (options.clientTpl) { %>, 'patterns/**/template/*.js', 'patterns/**/template/partial/*.js'<% } %>] }))
					.pipe(plugins.remember(asset.name))
					.pipe(plugins.concat(asset.name))
					.pipe(plugins.header(banner, { bannerData }))
					.pipe(plugins.sourcemaps.write('.'))
					.pipe(plugins.plumber.stop())
					.pipe(gulp.dest('public/assets/js'))
					.on('end', () => {
						resolve();
					});
			}));
		});

		return Promise.all(promises)
			.then(() => {
				if (config.get('nitro.mode.livereload')) {
					browserSync.reload('*.js');
				}
			});
	};
};
