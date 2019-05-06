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
		regex: /^viewlist\s*([\S\s]+?)?$/,
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
				const viewIncludes = data.viewIncludes ? data.viewIncludes : '';
				const viewExcludes = data.viewExcludes ? data.viewExcludes : '';

				const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
				const markup = ['<ul>'];

				let filteredViews = views;

				if (viewIncludes !== '') {
					const viewIncludesArray = viewIncludes.split(';');
					filteredViews = views.filter((viewItem) => {
						return viewIncludesArray.some((includeString) => {
							return viewItem.url.indexOf(includeString) >= 0;
						});
					});
				} else if (viewExcludes !== '') {
					const viewExcludesArray = viewExcludes.split(';');
					filteredViews = views.filter((viewItem) => {
						return viewExcludesArray.every((excludeString) => {
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
