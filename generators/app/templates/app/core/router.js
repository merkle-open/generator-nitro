'use strict';

const path = require('path');
const fs = require('fs');
const config = require('./config');
const utils = require('./utils');
const view = require('../lib/view');
const dot = require('dot-object');
const extend = require('extend');
const express = require('express');
const router = express.Router({
	caseSensitive: false,
	strict: false,
});
const isProduction = config.server.production;

/**
 * static routes
 */
router.use('/', express.static(config.nitro.base_path + '/public/'));

/**
 * views
 */
function getView(req, res, next) {
	const tpl = req.params.view ? req.params.view.toLowerCase() : 'index';
	let data = {
		pageTitle: tpl,
		_layout: config.nitro.default_layout,
		_production: isProduction
	};
	const viewPathes = view.getViewCombinations(tpl);
	let rendered = false;

	viewPathes.forEach((viewPath) => {
		if (!rendered) {
			const tplPath = path.join(
				config.nitro.base_path,
				config.nitro.view_directory,
				'/',
				viewPath + '.' + config.nitro.view_file_extension
			);

			if (utils.fileExistsSync(tplPath)) {

				// collect data
				const dataPath = path.join(
					config.nitro.base_path,
					config.nitro.view_data_directory,
					'/',
					viewPath + '.json'
				);
				const customDataPath = req.query._data ? path.join(
					config.nitro.base_path,
					config.nitro.view_data_directory,
					'/' + req.query._data + '.json'
				) : false;

				if (customDataPath && utils.fileExistsSync(customDataPath)) {
					extend(true, data, JSON.parse(fs.readFileSync(customDataPath, 'utf8')));
				}
				else if (utils.fileExistsSync(dataPath)) {
					extend(true, data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
				}

				// handle query string parameters
				if (Object.keys(req.query).length !== 0) {
					let reqQuery = JSON.parse(JSON.stringify(req.query)); // simple clone
					dot.object(reqQuery);
					extend(true, data, reqQuery);
					data._query = reqQuery; // save query for use in patterns
				}

				// layout handling
				if (data._layout) {
					if (utils.layoutExists(data._layout)) {
						data.layout = utils.getLayoutPath(data._layout);
					}
					else if (utils.layoutExists(config.nitro.default_layout)) {
						data.layout = utils.getLayoutPath(config.nitro.default_layout);
					}
				}

				// locals
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
router.use((req, res) => {
	res.locals.pageTitle = '404 - Not Found';
	res.locals._production = isProduction;
	if (utils.layoutExists(config.nitro.default_layout)) {
		res.locals.layout = utils.getLayoutPath(config.nitro.default_layout);
	}
	res.status(404);
	res.render('404', function (err, html) {
		if (err) {
			res.send('404 - Not Found');
		}
		res.send(html);
	});
});

module.exports = router;
