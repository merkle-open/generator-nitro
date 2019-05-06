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
