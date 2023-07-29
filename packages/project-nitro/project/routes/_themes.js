'use strict';

const extend = require('extend');
const cookieSession = require('cookie-session');
const config = require('config');
const validThemes = config.has('themes') && Array.isArray(config.get('themes')) ? config.get('themes') : false;

/**
 * enrich result with theme info
 * stores value in session cookie
 */

function getValidatedThemeId(theme) {
	if (theme && validThemes.find((t) => t.id === theme)) {
		return theme;
	}

	return false;
}

function theme(req, res, next) {
	// console.log('Enhancing view data with theme data');

	const isPage =
		!req.path.match(/^\/favicon.ico/) &&
		!req.path.match(/^\/api\//) &&
		!req.path.match(/^\/assets\//) &&
		!req.path.match(/^\/content\//) &&
		!req.path.match(/^\/proto\//) &&
		!req.path.match(/^\/reports\//) &&
		!req.path.match(/^\/static\//);

	// enrich locals with theme data on all pages
	if (isPage) {
		const theme =
			getValidatedThemeId(process.env.THEME) ||
			(req.session && req.session.theme && getValidatedThemeId(req.session.theme)) ||
			validThemes.find((theme) => theme.isDefault).id;
		const themeData = validThemes.find((t) => t.id === theme);

		extend(true, res.locals, { theme: themeData });
	}

	next();
}

module.exports = (app) => {
	if (validThemes) {
		// check and handle theme session on production environment
		if (app.get('env') === 'production') {
			app.use(
				cookieSession({
					name: 'theme',
					keys: ['keeeeeeeeeeey', 'schlüssel'],
				}),
			);

			for (const theme of validThemes) {
				app.route(`/theme/${theme.id}`).get((req, res, next) => {
					req.session.theme = theme.id;

					if (req.query && req.query.ref) {
						res.redirect(req.query.ref);
					} else {
						res.redirect('/index');
					}
				});
			}
		}

		app.route('*').get(theme);
	}
};
