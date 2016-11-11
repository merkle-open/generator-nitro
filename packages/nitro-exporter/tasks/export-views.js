const es = require('event-stream');
const fs = require('fs');
const path = require('path');
const request = require('request');
const utils = require('../lib/utils.js');

module.exports = function (gulp, config) {
	'use strict';

	const processes = [];

	utils.each(config.exporter, (configEntry) => {
		/**
		* Call and save given view in filesystem.
		* @param {string} url The URL to the view.
		* @param {string} dest The destination file path for the views HTML.
		* @param {function} cb A callback function, that is executed after the file has been saved.
		* @returns {null} No return value.
		*/
		function getView(url, dest, cb) {
			request(url, (err, response, body) => {
				fs.writeFileSync(dest, body);
				cb();
			});
		}

		/**
		* Base function to load a view from Nitro.
		* @param {Any} esi The event stream instance for the view files.
		* @returns {Any} The event stream .map return.
		*/
		function loadView(esi) {
			return esi.map((file, cb) => {
				const viewPath = path.relative('views', file.path);
				let viewName = path.basename(viewPath, `.${config.nitro.view_file_extension}`);
				let viewRoute = '';
				let url = '';
				let dest = '';

				if (path.dirname(viewPath) !== '.') {
					viewName = path.dirname(viewPath) + path.sep + viewName;
				}

				viewRoute = viewName.replace(path.sep, '-');

				url = `http://localhost:${config.server.port}/${viewRoute}`;
				dest = `${configEntry.dest}${path.sep}${viewRoute}.html`;

				if (configEntry.i18n.length) {
					const promises = [];
					configEntry.i18n.forEach((lang) => {
						promises.push(new Promise((resolve) => {
							getView(
								`${url}?lang=${lang}`,
								dest.replace('.html', `-${lang}.html`),
								resolve
							);
						}));
					});
					Promise.all(promises).then(() => {
						cb();
					});
				} else {
					getView(
						url,
						dest,
						cb
					);
				}
				return true;
			});
		}
		const views = configEntry.views;
		const excludeFolders = [
			config.nitro.view_partials_directory,
			config.nitro.view_data_directory,
			config.nitro.view_layouts_directory,
			config.nitro.placeholders_directory
		].map((item) => item.replace(`${config.nitro.view_directory}/`, ''));
		let viewGlobs = [
			`${config.nitro.view_directory}/!(${excludeFolders.join('|')})/**/*.${config.nitro.view_file_extension}`,
			`${config.nitro.view_directory}/*.${config.nitro.view_file_extension}`
		];

		if (views) {
			try {
				fs.mkdirSync(configEntry.dest);
			} catch (e) {
				if (e.code !== 'EEXIST') {
					console.error(e.message);
				}
			}

			if (typeof views === 'object' && views.length) {
				viewGlobs = [];
				views.forEach((view) => {
					viewGlobs.push(config.nitro.view_directory + path.sep + view);
				});
			}
		} else {
			return;
		}

		processes.push(
			gulp.src(viewGlobs)
				.pipe(loadView(es))
		);
	});

	return () => Promise.all(processes);
};
