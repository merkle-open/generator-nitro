'use strict';

/**
 * Usage:
 *  /api/countries/search
 *
 * To get results you have to provide a search query:
 *  /api/countries/search?query=sw
 */

const path = require('path');
const fs = require('fs');
const utils = require('./helpers/utils.js');

function search(req, res, next) {
	// validation
	if (!req.query.query) {
		return res.json([]);
	}

	// load typeahead data
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/countries.json')));
	let items = data;

	// title search
	if (req.query.query) {
		const regex = new RegExp(req.query.query, 'i');
		items = items.filter((item) => regex.test(item.name) || regex.test(item.code));
	}

	setTimeout(() => {
		return res.json(items);
	}, utils.getRandomInt(250,1000));
}

module.exports = (app) => {
	app.route('/api/countries/search')
		.get(search);
};
