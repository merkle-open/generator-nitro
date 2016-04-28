var path = require('path');
var fs = require('fs');
var cfg = require('./config');
var utils = require('./utils');
var dot = require('dot-object');
var extend = require('extend');
var express = require('express');
var router = express.Router({
	caseSensitive: false,
	strict:        false
});

/**
 * static routes
 */
router.use('/', express.static(cfg.nitro.base_path + '/public/'));

/**
 * views
 */
function getView(req, res, next) {
	var getViewCombinations = function getViewCombinations(action) {
		var pathes = [action];
		var positions = [];
		var i, j;

		for (i = 0; i < action.length; i++) {
			if (action[i] === '-') {
				positions.push(i);
			}
		}

		var len = positions.length;
		var combinations = [];

		for (i = 1; i < ( 1 << len ); i++) {
			var c = [];
			for (j = 0; j < len; j++) {
				if (i & ( 1 << j )) {
					c.push(positions[j]);
				}
			}
			combinations.push(c);
		}

		combinations.forEach(function (combination) {
			var path = action;
			combination.forEach(function (pos) {
				path = replaceAt(path, pos, '/');
			});
			pathes.push(path);
		});
		return pathes;
	};
	var replaceAt = function replaceAt(string, index, character) {
		return string.substr(0, index) + character + string.substr(index + character.length);
	};

	var tpl = req.params.view ? req.params.view.toLowerCase() : 'index';
	var data = {
		pageTitle: tpl
	};
	var viewPathes = getViewCombinations(tpl);
	var rendered = false;

	viewPathes.forEach(function (viewPath) {
		if (!rendered) {
			var tplPath = path.join(
				cfg.nitro.base_path,
				cfg.nitro.view_directory,
				'/',
				viewPath + '.' + cfg.nitro.view_file_extension
			);

			if (utils.fileExistsSync(tplPath)) {

				// collect data
				var dataPath = path.join(
					cfg.nitro.base_path,
					cfg.nitro.view_data_directory,
					'/',
					viewPath + '.json'
				);
				var customDataPath = req.query._data ? path.join(
					cfg.nitro.base_path,
					cfg.nitro.view_data_directory,
					'/' + req.query._data + '.json'
				) : false;

				if (customDataPath && utils.fileExistsSync(customDataPath)) {
					extend(true, data, JSON.parse(fs.readFileSync(customDataPath, 'utf8')));
				}
				else if (utils.fileExistsSync(dataPath)) {
					extend(true, data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
				}

				if (Object.keys(req.query).length !== 0) { // handle query string parameters
					var reqQuery = JSON.parse(JSON.stringify(req.query)); // simple clone
					dot.object(reqQuery);
					extend(true, data, reqQuery);
					data._query = reqQuery; // save query for use in components
				}

				extend(true, data, res.locals);
				res.locals = data;

				// render
				res.render(tplPath);
				rendered = true;
			}
		}
	});

	if (!rendered) {
		next();
	}
}
router.get('/', getView);
router.get('/:view', getView);

/**
 * everything else gets a 404
 */
router.use(function (req, res) {
	res.locals.pageTitle = '404 - Not Found';
	res.status(404);
	res.render('404', function (err, html) {
		if (err) {
			res.send('404 - Not Found');
		}
		res.send(html);
	});
});

module.exports = router;
