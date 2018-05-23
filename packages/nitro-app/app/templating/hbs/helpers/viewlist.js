'use strict';

const hbs = require('hbs');
const config = require('config');
const view = require('../../../lib/view.js');

module.exports = function viewlist() {
	const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
	const markup = ['<ul>'];

	views.forEach((viewItem) => {
		markup.push(`<li><a href="/${viewItem.url}">${viewItem.name}</a></li>`);
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
