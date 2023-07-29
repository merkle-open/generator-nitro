'use strict';

/**
 * Usage:
 *  /api/lottie/:animation
 *
 * Returns lottie animation json
 */

const path = require('path');
const fs = require('fs');
const utils = require('./helpers/utils.js');

function animation(req, res, next) {
	// load animation data
	const file = path.join(__dirname, './data/lottie', req.params.animation);
	let data = { error: true };
	if (fs.existsSync(file)) {
		data = JSON.parse(fs.readFileSync(file));
	}

	setTimeout(
		() => {
			return res.json(data);
		},
		utils.getRandomInt(250, 1000),
	);
}

module.exports = (app) => {
	app.route('/api/lottie/:animation').get(animation);
};
