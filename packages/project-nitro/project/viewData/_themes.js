'use strict';

const extend = require('extend');
const utils = require('@nitro/app/app/lib/utils');
const view = require('@nitro/app/app/lib/view');

const validThemes = utils.getValidThemes();

/**
 * enrich view data with theme info
 */

function getValidatedThemeById(theme) {
	if (theme && validThemes.find((t) => t.id === theme)) {
		return theme;
	}

	return false;
}

function theme(req, res, next) {
	// enrich locals with theme data on all pages
	if (view.isView(req)) {
		const theme =
			getValidatedThemeById(process.env.THEME) ||
			(req.session && req.session.theme && getValidatedThemeById(req.session.theme)) ||
			validThemes.find((theme) => theme.isDefault).id;
		const themeData = validThemes.find((t) => t.id === theme);

		extend(true, res.locals, { theme: themeData });
	}

	next();
}

module.exports = (app) => {
	if (validThemes) {
		app.route('*').all(theme);
	}
};
