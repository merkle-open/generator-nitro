/**
 * Viewlist helper, can be used to display lists of views filtered by specific include / exclude terms
 *
 * Usage:
 *
 * Without parameter, all views will be displayed
 * {{viewlist}}
 *
 * With parameter include, all views containing at least one of the terms will be displayed
 * {{viewlist include="<term-1>,<term-2>"}}
 *
 * With parameter exclude, all views containing none of the terms will be displayed
 * {{viewlist exclude="<term-1>,<term-2>"}}
 *
 * With parameter include and exclude combined, all views containing at least one of the terms but none of the excluded ones will be displayed
 * {{viewlist include="<term-1>" exclude="term-2"}}
 *
 */

'use strict';

const hbs = require('hbs');
const config = require('config');
const view = require('../../../lib/view.js');

module.exports = function () {
	const context = arguments[arguments.length - 1];
	const include = context.hash.include ? context.hash.include : '';
	const exclude = context.hash.exclude ? context.hash.exclude : '';

	const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
	const markup = ['<ul>'];

	let filteredViews = views;

	if (include !== '') {
		const includeArray = include.split(',');
		filteredViews = filteredViews.filter((viewItem) => {
			return includeArray.some((includeString) => {
				return viewItem.url.indexOf(includeString) >= 0;
			});
		});
	}

	if (exclude !== '') {
		const excludeArray = exclude.split(',');
		filteredViews = filteredViews.filter((viewItem) => {
			return excludeArray.every((excludeString) => {
				return viewItem.url.indexOf(excludeString) === -1;
			});
		});
	}

	filteredViews.forEach((viewItem) => {
		markup.push(`<li><a href="/${viewItem.url}">${viewItem.name}</a></li>`);
	});

	if (filteredViews.length === 0) {
		markup.push('<li>For this include / exclude term, no pages were found</li>');
	}

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
