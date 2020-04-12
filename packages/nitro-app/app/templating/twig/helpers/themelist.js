'use strict';

/**
 * themelist helper, can be used to display lists of themes based on the config theme array
 */

const config = require('config');
const view = require('../../../lib/view.js');
const twigUtils = require('../utils');

module.exports = function (Twig) {
	return {
		type: 'themelist',
		regex: /^themelist\s*([\S\s]+?)?$/,
		next: [],
		open: true,
		compile (token) {
			const data = (typeof token.match[1] !== 'undefined') ? token.match[1] : '';

			token.variantStack = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: data.trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse (token, context, chain) {
			try {
				const data = Twig.expression.parse.apply(this, [token.variantStack, context]) ? Twig.expression.parse.apply(this, [token.variantStack, context]) : {};
				const include = data.include ? data.include : '';
				const exclude = data.exclude ? data.exclude : '';

				const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
				const markup = ['<ul>'];

				let filteredViews = views;

				if (include !== '') {
					const includeArray = include.split(',');
					filteredViews = views.filter((viewItem) => {
						return includeArray.some((includeString) => {
							return viewItem.url.indexOf(includeString) >= 0;
						});
					});
				}

				if (exclude !== '') {
					const excludeArray = exclude.split(',');
					filteredViews = views.filter((viewItem) => {
						return excludeArray.every((excludeString) => {
							return viewItem.url.indexOf(excludeString) === -1;
						});
					});
				}

				filteredViews.forEach((viewItem) => {
					markup.push(`<li><a href="/${viewItem.url}">${viewItem.name}</a></li>`);
				});

				if (filteredViews.length === 0) {
					markup.push('<li>For this include / exclude term, no pages where found</li>');
				}

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
