var path = require('path'),
	fs = require('fs'),
	cfg = require('./config'),
	express = require('express'),
	router = express.Router({
		caseSensitive: false,
		strict:        false
	});

router.use('/', express.static(cfg.nitro.base_path + '/public/'));
router.use('/', express.static(cfg.nitro.base_path + '/assets/'));

/**
 * index
 * TODO: List views if no index
 */
router.get('/', function (req, res) {
	var tplPath = path.join(
			cfg.nitro.view_directory,
			'index.' + cfg.nitro.view_file_extension
		),
		data = {
			pageTitle: 'Index'
		};

	fs.exists(tplPath, function (exists) {
		if (exists) {
			res.render('index', data);
		}
		else {
			res.status(404);
			res.send('Not Found. (Please add an index template)');
		}
	});
});

/**
 * TODO: Terrific Template in /app
 */
router.get('/terrific', function (req, res) {
	res.send('Terrific GUI');
});

/**
 * view templates
 */
router.get('/:view', function (req, res, next) {

	var getViewCombinations = function getViewCombinations (action) {
		var pathes = [action],
			positions = [],
			i, j;

		for(i=0; i<action.length;i++) {
			if (action[i] === '-') {
				positions.push(i);
			}
		}

		var len = positions.length;
		var combinations = [];

		for ( i = 1; i < ( 1 << len ); i ++ ) {
			var c = [];
			for ( j = 0; j < len; j ++ ) {
				if ( i & ( 1 << j ) ) {
					c.push(positions[j]);
				}
			}
			combinations.push(c);
		}

		combinations.forEach(function(combination){
			var path = action;
			combination.forEach(function(pos){
				path = replaceAt(path, pos, '/');
			});
			pathes.push(path);
		});
		return pathes;
	};
	var replaceAt = function replaceAt (string, index, character) {
		return string.substr(0, index) + character + string.substr(index+character.length);
	};

	var tpl = req.params.view.toLowerCase(),
		data = {
			pageTitle: tpl
		},
		viewPathes = getViewCombinations(tpl),
		rendered = false;

	viewPathes.forEach(function(viewPath){
		if (!rendered) {
			var tplPath = path.join(
				cfg.nitro.view_directory,
				'/',
				viewPath + '.' + cfg.nitro.view_file_extension
			);

			if (fs.existsSync(tplPath)) {
				res.render(tplPath, data);
				rendered = true;
			}
		}
	});

	if (!rendered) {
		next();
	}
});

/**
 * everything else gets a 404
 * TODO: Nice looking 404?
 */
router.use(function(req, res, next) {
	res.status(404).send('Sorry, Not Found!');
});

module.exports = router;
