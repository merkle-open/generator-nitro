'use strict';

/* global process */

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
const view = require('@nitro/app/app/lib/view');
const del = require('del');
const getPort = require('get-port');

const serverPath = require('@nitro/app/app/lib/utils').getServerPath();
const tmpDirectory = `${config.get('nitro.tmpDirectory')}/views`;
const viewFilter = (viewItem) => {
	if (config.has('gulp.dumpViews.viewFilter') && typeof config.get('gulp.dumpViews.viewFilter') === 'function') {
		return config.get('gulp.dumpViews.viewFilter')(viewItem.url);
	}
	return true;
};

let isRunning = false;
let server;

function getViews() {
	return view
		.getViews(`${config.get('nitro.basePath')}${config.get('nitro.viewDirectory')}`)
		.filter(viewFilter)
		.map((viewItem) => viewItem.url);
}

function getViewsToDump() {
	const views = getViews();
	let dumpedViews = [];
	let languages = (argv.locales === undefined) ? [] : argv.locales.split(',');
	if (process.env.NITRO_VIEW_LOCALES) {
		languages = process.env.NITRO_VIEW_LOCALES.split(',');
	}
	if (languages.length) {
		languages.forEach((lng) => {
			dumpedViews = dumpedViews.concat(views.map((v) => {
				return (lng !== 'default') ? `${v}?lang=${lng}` : v;
			}));
		});
	} else {
		dumpedViews = views;
	}

	// add additional routes from env
	const additionalRoutes = (process.env.NITRO_ADDITIONAL_ROUTES) ? process.env.NITRO_ADDITIONAL_ROUTES.split(',') : [];
	dumpedViews = dumpedViews.concat(additionalRoutes);

	return dumpedViews;
}

function startTmpServer(port, gulp, plugins, cb) {
	server = plugins.liveServer(serverPath, {
		env: {
			PORT: port,
			NODE_ENV: 'production',
		},
	}, false);

	return server.start()
		.then(() => {}, () => {}, () => {
			if (!isRunning) {
				isRunning = true;
				if (typeof cb === 'function') {
					cb();
				}
			}
		});
}

function stopTmpServer() {
	server.stop();
	isRunning = false;
}

function dumpViews(port, gulp, plugins) {
	return del(tmpDirectory)
		.then(() => {
			const views = getViewsToDump();
			return plugins.remoteSrc(views, {
				base: `http://localhost:${port}/`,
				buffer: true,
			})
				.pipe(plugins.rename((path) => {
					const lang = path.basename.match(/\?lang=([a-z]+)/);
					path.extname = path.extname || '.html';
					if (lang) {
						path.basename = path.basename.replace(/\?lang=[a-z]+/, '');
						path.basename += `-${lang[1]}`;
					}
				}))
				.pipe(gulp.dest(tmpDirectory))
				.on('end', () => {
					stopTmpServer();
				});
		});
}

module.exports = (gulp, plugins) => {
	return () => {
		return getPort()
			.then((port) => {
				const cb = () => {
					return dumpViews(port, gulp, plugins);
				};
				return startTmpServer(port, gulp, plugins, cb);
			});
	};
};
