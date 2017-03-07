'use strict';

const argv = require('yargs').argv;
const config = require('../app/core/config.js');
const view = require('../app/lib/view.js');
const del = require('del');
const getPort = require('get-port');
const utils = require('./utils');
const tmpDirectory = utils.getTmpDirectory('views');

function getViews () {
	return view
		.getViews(config.nitro.base_path + config.nitro.view_directory)
		.map((view) => view.url);
}

module.exports = function (gulp, plugins) {
	return () => {
		return getPort()
			.then((port) => {
				const server = plugins.liveServer('server', {
					env: {
						PORT: port,
						NODE_ENV: 'production'
					}
				}, false);

				function dumpViews() {
					return del(tmpDirectory)
						.then(() => {
								let views = getViews();
								const languages = (argv.locales === undefined) ? [] : argv.locales.split(',');

								if(languages.length) {
									const viewsAmount = views.length;
									languages.filter(lng => lng !== 'default').map(lng => {
										views = views.concat(views.map(v => v += `?lang=${lng}`));
									});
									if(!languages.includes('default')) {
										views.splice(0, viewsAmount);
									}
								}

								return plugins.remoteSrc(views, {
									base: `http://localhost:${port}/`,
									buffer: true
								})
									.pipe(plugins.rename(function (path) {
										const lang = path.basename.match(/\?lang=([a-z]+)/);
										path.extname = '.html';
										if(lang) {
											path.basename = path.basename.replace(/\?lang=[a-z]+/, '')
											path.basename += `-${lang[1]}`;
										}
									}))
									.pipe(gulp.dest(tmpDirectory))
									.on('end', () => {
										server.stop();
									});
							}
						);
				}

				return server.start()
					.then(() => {},() => {}, () => dumpViews());
			});
	};
};
