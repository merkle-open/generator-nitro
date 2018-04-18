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

module.exports = function (Twig) {
	return {
		type: 'viewlist',
		regex: /^viewlist$/,
		next: [],
		open: true,
		compile: function(token) {
			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			try {
				const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
				const markup = ['<ul>'];

				views.forEach((viewItem) => {
					markup.push(`<li><a href="/${viewItem.url}">${viewItem.name}</a></li>`);
				});

				markup.push('</ul>');

				// return the markup
				return {
					chain: chain,
					output: markup.join('')
				};

			} catch (e) {
				return {
					chain: chain,
					output: twigUtils.logAndRenderError(e)
				};
			}
		}
	};
};
