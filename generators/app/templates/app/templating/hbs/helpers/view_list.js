'use strict';

const hbs = require('hbs');
const config = require('config');
const view = require('../../../lib/view.js');

module.exports = function view_list () {
	const views = view.getViews(config.get('nitro.basePath') + config.get('nitro.viewDirectory'));
	let markup = ['<ul>'];

	views.forEach((view) => {
		markup.push(`<li><a href="/${view.url}">${view.name}</a></li>`);
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
