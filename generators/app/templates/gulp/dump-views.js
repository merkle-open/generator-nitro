'use strict';

/**
 * Usage:
 *  gulp dump-views
 *
 * You can optionally dump views with specific locales:
 *
 *  gulp dump-views --locales de,en
 *
 * If you want to export default templates you have to explicitly set the "default" language:
 *
 *  gulp dump-views --locales default,de,en
 *
 * If you specify languages, your HTML views will be suffixed with the provided locale, e.g. index-en.html
 */

const argv = require('yargs').argv;
const config = require('config');
const view = require('../app/lib/view');
const del = require('del');
const getPort = require('get-port');
const utils = require('./utils');
const tmpDirectory = utils.getTmpDirectory('views');
let isRunning = false;

function getViews() {
	return view
		.getViews(`${config.get('nitro.basePath')}${config.get('nitro.viewDirectory')}`)
		.map((viewItem) => viewItem.url);
}

function dumpViews(server, port, gulp, plugins) {
	isRunning = true;
	return del(tmpDirectory)
		.then(() => {
			const views = getViews();
			let dumpedViews = [];
			const languages = (argv.locales === undefined) ? [] : argv.locales.split(',');

			if (languages.length) {
				languages.filter((lng) => lng !== 'default').forEach((lng) => {
					dumpedViews = dumpedViews.concat(views.map((v) => v += `?lang=${lng}`));
				});
				if (languages.includes('default')) {
					Array.prototype.unshift.apply(dumpedViews, views);
				}
			} else {
				dumpedViews = views;
			}

			return plugins.remoteSrc(dumpedViews, {
				base: `http://localhost:${port}/`,
				buffer: true,
			})
				.pipe(plugins.rename((path) => {
					const lang = path.basename.match(/\?lang=([a-z]+)/);
					path.extname = '.html';
					if (lang) {
						path.basename = path.basename.replace(/\?lang=[a-z]+/, '');
						path.basename += `-${lang[1]}`;
					}
				}))
				.pipe(gulp.dest(tmpDirectory))
				.on('end', () => {
					server.stop();
					isRunning = false;
				});
		});
}

module.exports = (gulp, plugins) => {
	return () => {
		return getPort()
			.then((port) => {
				const server = plugins.liveServer('server', {
					env: {
						PORT: port,
					},
				}, false);

				return server.start()
					.then(() => {}, () => {}, () => {
						if (!isRunning) {
							dumpViews(server, port, gulp, plugins);
						}
					});
			});
	};
};
