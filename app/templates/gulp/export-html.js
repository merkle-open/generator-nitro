var config = require('../app/core/config');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;
var request = require('request');

module.exports = function (gulp) {
	'use strict';

	function getView(url, dest, cb) {
		request(url, function (err, response, body) {
			fs.writeFileSync(dest, body);
			cb();
		});
	}

	function loadView(es) {
		return es.map(function (file, callback) {
			var viewPath = path.relative('views', file.path);
			var viewName = path.basename(viewPath, '.' + config.nitro.view_file_extension);
			var viewRoute;
			var url;
			var dest;

			if(path.dirname(viewPath) !== '.') {
				viewName = path.dirname(viewPath) + path.sep + viewName;
			}

			viewRoute = viewName.replace(path.sep, '-');

			url = 'http://localhost:' + config.server.port + '/' + viewRoute;
			dest = config.exporter.dest + path.sep + viewRoute + '.html';

			if(config.exporter.i18n.length) {
				var promises = [];
				config.exporter.i18n.forEach(function (lang) {
					promises.push(new Promise(function (resolve) {
						getView(
							url + '?lang=' + lang,
							dest.replace('.html', '-' + lang + '.html'),
							resolve
						);
					}));
				});
				Promise.all(promises).then(function() {
					callback();
				});
			} else {
				getView(
					url,
					dest,
					callback
				);
			}
		});
	}
	return function () {
		var pid = fs.readFileSync('.servepid', {
			encoding: 'utf8'
		});
		var views = config.exporter.views;
		var viewGlobs = [
			config.nitro.view_directory + '/!(_partials)/**/*.hbs',
			config.nitro.view_directory + '/*.hbs'
		];

		if(views) {
			try {
				fs.mkdirSync(config.exporter.dest);
			} catch(e) {}

			if(typeof views === 'object' && views.length) {
				viewGlobs = [];
				views.forEach(function(view) {
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
			.on('error', function () {
				process.kill(pid);
				fs.unlinkSync('.servepid');
			})
			.on('end', function () {
				process.kill(pid);
				fs.unlinkSync('.servepid');
			});
	};
};
