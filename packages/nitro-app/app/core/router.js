'use strict';

const path = require('path');
const fs = require('fs');
const config = require('config');
const utils = require('./utils');
const view = require('../lib/view');
const dot = require('dot-object');
const extend = require('extend');
const express = require('express');
// eslint-disable-next-line
const router = express.Router({
	caseSensitive: false,
	strict: false,
});
const isProduction = config.get('server.production');
const isTest = config.get('nitro.mode.test');
const isOffline = config.get('nitro.mode.offline');
const view404 = config.get('nitro.view404');

/**
 * static routes
 */
router.use('/', express.static(`${config.get('nitro.basePath')}/public/`));

/**
 * views
 * @returns _nitro object
 */
function getNitroViewData(pageTitle, req) {
	return {
		_nitro: {
			pageUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
			pageTitle,
			production: isProduction,
			test: isTest,
			offline: isOffline,
		},
	};
}

function collectViewData(viewPath, defaultData, req) {
	const data = {};
	const tplPath = path.join(
		config.get('nitro.basePath'),
		config.get('nitro.viewDirectory'),
		'/',
		`${viewPath}.${config.get('nitro.viewFileExtension')}`
	);

	extend(true, data, defaultData);

	if (!fs.existsSync(tplPath)) {
		return false;
	}

	// collect data
	const dataPath = path.join(
		config.get('nitro.basePath'),
		config.get('nitro.viewDataDirectory'),
		'/',
		`${viewPath}.json`
	);
	const customDataPath = req.query._data
		? path.join(config.get('nitro.basePath'), config.get('nitro.viewDataDirectory'), `/${req.query._data}.json`)
		: false;

	if (customDataPath && fs.existsSync(customDataPath)) {
		extend(true, data, JSON.parse(fs.readFileSync(customDataPath, 'utf8')));
	} else if (fs.existsSync(dataPath)) {
		extend(true, data, JSON.parse(fs.readFileSync(dataPath, 'utf8')));
	}

	// handle query string parameters
	if (Object.keys(req.query).length !== 0) {
		// simple clone
		const reqQuery = JSON.parse(JSON.stringify(req.query));
		dot.object(reqQuery);
		extend(true, data, reqQuery);
		// save query for use in patterns
		data._query = reqQuery;
	}

	// layout handling
	if (data._layout) {
		if (utils.layoutExists(data._layout)) {
			data.layout = utils.getLayoutPath(data._layout);
		}
	}
	if (!data.layout || !utils.layoutExists(utils.getLayoutName(data.layout))) {
		// use default layout if present
		if (utils.layoutExists(config.get('nitro.defaultLayout'))) {
			data.layout = utils.getLayoutPath(config.get('nitro.defaultLayout'));
		}
	}

	return {
		tplPath,
		data,
	};
}

function getView(req, res, next) {
	const tpl = req.params.view ? req.params.view.toLowerCase() : 'index';
	const data = getNitroViewData(tpl, req);
	const viewPathes = view.getViewCombinations(tpl);
	let rendered = false;

	extend(true, data, res.locals);

	viewPathes.forEach((viewPath) => {
		if (!rendered) {
			const viewData = collectViewData(viewPath, data, req);
			if (viewData) {
				res.locals = viewData.data;
				res.render(viewData.tplPath);
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
// subpathes will be routed to the main view if it exists
router.get('/:view/*', getView);

/**
 * everything else gets a 404
 */
router.use((req, res) => {
	const data = getNitroViewData('404 - Not Found', req);
	extend(true, data, res.locals);

	const viewData = collectViewData(view404, data, req);
	if (viewData) {
		res.locals = viewData.data;
	}

	res.status(404);
	res.render(view404, (err, html) => {
		if (err) {
			res.send('404 - Not Found');
		}
		res.send(html);
	});
});

module.exports = router;
