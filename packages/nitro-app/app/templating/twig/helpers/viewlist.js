'use strict';

/**
 * twig helper: {% viewlist %}
 *
 * Usage
 * {% viewlist %}
 *
 */

const config = require('config');
const view = require('../../../lib/view.js');
const twigUtils = require('../utils');

module.exports = function () {
	return {
		type: 'viewlist',
		regex: /^viewlist$/,
		next: [],
		open: true,
		compile: (token) => {
			delete token.match;
			return token;
		},
		parse: (token, context, chain) => {
			try {
				const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
				const markup = ['<ul>'];

				views.forEach((viewItem) => {
					markup.push(`<li><a href="/${viewItem.url}">${viewItem.name}</a></li>`);
				});

				markup.push('</ul>');

				// return the markup
				return {
					chain,
					output: markup.join('')
				};

			} catch (e) {
				return {
					chain,
					output: twigUtils.logAndRenderError(e)
				};
			}
		}
	};
};
