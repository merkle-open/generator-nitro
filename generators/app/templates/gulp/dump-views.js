'use strict';

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
								return plugins.remoteSrc(getViews(), {
									base: `http://localhost:${port}/`,
									buffer: true
								})
									.pipe(plugins.rename({extname: '.html'}))
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
