'use strict';

const utils = require('@nitro/app/app/lib/utils');

const validThemes = utils.getValidThemes();

/**
 * check and handle theme session on production environments
 */

module.exports = (app) => {
	if (app.get('env') === 'production') {
		if (validThemes) {
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
	}
};
