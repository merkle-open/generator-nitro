'use strict';

const config = require('./config');
const partialMatch = new RegExp('\.' + config.nitro.view_file_extension + '$');

module.exports = function (hbs) {
	const hbsutils = require('hbs-utils')(hbs);
	const registerPartial = config.server.production ? 'registerPartials' : 'registerWatchedPartials';

	hbsutils[registerPartial](config.nitro.base_path + config.nitro.view_partials_directory, {
		match: partialMatch,
		name: function(template) {
			// fix template path for subfolders on windows
			return template.replace(/\\/g, '/');
		}
	});
};
