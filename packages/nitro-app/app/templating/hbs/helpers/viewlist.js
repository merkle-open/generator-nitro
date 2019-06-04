/**
 * Viewlist helper, can be used to display lists of views filtered by specific include / exclude terms
 *
 * Usage:
 *
 * Without parameter, all views will be displayed
 * {{viewlist}}
 *
 * With parameter viewIncludes, all views containing at least one of the terms will be displayed
 * {{viewlist viewIncludes="<term-1>;<term-2>"}}
 *
 * With parameter viewExcludes, all views containing none of the terms will be displayed
 * {{viewlist viewExcludes="<term-1>;<term-2>"}}
 *
 */

'use strict';

const hbs = require('hbs');
const config = require('config');
const view = require('../../../lib/view.js');

module.exports = function () {
	const context = arguments[arguments.length - 1];
	const viewIncludes = context.hash.viewIncludes ? context.hash.viewIncludes : '';
	const viewExcludes = context.hash.viewExcludes ? context.hash.viewExcludes : '';

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

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
