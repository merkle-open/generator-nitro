const es = require('event-stream');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports = function (gulp, config) {
	'use strict';

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
		return esi.map((file, callback) => {
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
			dest = `${config.exporter.dest}${path.sep}${viewRoute}.html`;

			if (config.exporter.i18n.length) {
				const promises = [];
				config.exporter.i18n.forEach((lang) => {
					promises.push(new Promise((resolve) => {
						getView(
							`${url}?lang=${lang}`,
							dest.replace('.html', `-${lang}.html`),
							resolve
						);
					}));
				});
				Promise.all(promises).then(() => {
					callback();
				});
			} else {
				getView(
					url,
					dest,
					callback
				);
			}
			return true;
		});
	}
	return function () {
		const pid = fs.readFileSync('.servepid', {
			encoding: 'utf8'
		});
		const views = config.exporter.views;
		const excludeFolders = [
			config.nitro.view_partials_directory,
			config.nitro.view_data_directory,
			config.nitro.placeholders_directory
		].map((item) => item.replace(`${config.nitro.view_directory}/`, ''));
		let viewGlobs = [
			`${config.nitro.view_directory}/!(${excludeFolders.join('|')})/**/*.${config.nitro.view_file_extension}`,
			`${config.nitro.view_directory}/*.${config.nitro.view_file_extension}`
		];

		if (views) {
			try {
				fs.mkdirSync(config.exporter.dest);
			} catch (e) {
				console.error(e);
			}

			if (typeof views === 'object' && views.length) {
				viewGlobs = [];
				views.forEach((view) => {
					viewGlobs.push(config.nitro.view_directory + path.sep + view);
				});
			}
		} else {
			process.kill(pid);
			fs.unlinkSync('.servepid');
			return;
		}

		return gulp.src(viewGlobs)
			.pipe(loadView(es))
			.on('error', () => {
				process.kill(pid);
				fs.unlinkSync('.servepid');
			})
			.on('end', () => {
				process.kill(pid);
				fs.unlinkSync('.servepid');
			});
	};
};
