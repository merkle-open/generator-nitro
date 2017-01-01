'use strict';

const hbs = require('hbs');
const config = require('../../../core/config.js');
const view = require('../../../lib/view.js');

module.exports = function view_list () {
	const views = view.getViews(config.nitro.base_path + config.nitro.view_directory);
	let markup = ['<ul>'];

	views.forEach((view) => {
		markup.push(`<li><a href="/${view.url}">${view.name}</a></li>`);
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
