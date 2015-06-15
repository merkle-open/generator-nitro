var path = require('path'),
	fs = require('fs'),
	cfg = require('./config'),
	merge = require('merge'),
	express = require('express'),
	router = express.Router({
		caseSensitive: false,
		strict: false
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
		var pathes = [action],
			positions = [],
			i, j;

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

	var tpl = req.params.view ? req.params.view.toLowerCase() : 'index',
		data = {
			pageTitle: tpl
		},
		viewPathes = getViewCombinations(tpl),
		rendered = false;

	viewPathes.forEach(function (viewPath) {
		if (!rendered) {
			var tplPath = path.join(
				cfg.nitro.view_directory,
				'/',
				viewPath + '.' + cfg.nitro.view_file_extension
			);

			if (fs.existsSync(tplPath)) {

				// collect data
				var dataPath = path.join(
					cfg.nitro.view_directory,
					'/_data/',
					viewPath + '.json'
				);
				var customDataPath = req.query._data ? path.join(
					cfg.nitro.view_directory,
					'/_data/',
					req.query._data + '.json'
				) : false;

				if (customDataPath && fs.existsSync(customDataPath)) {
					merge.recursive(data, JSON.parse(fs.readFileSync(customDataPath, 'utf8')));
				}
				else if (fs.existsSync(dataPath)) {
					merge.recursive(data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
				}

				if (Object.keys(req.query).length !== 0) {
					merge.recursive(data, req.query);
					data._query = req.query;
				}

				// render
				res.render(tplPath, data);
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
 * TODO: Nice looking 404?
 */
router.use(function (req, res, next) {
	res.status(404);
	res.render('404');
});

module.exports = router;
