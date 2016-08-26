var config = require('./config');
var partialMatch = new RegExp('\.' + config.nitro.view_file_extension + '$');

module.exports = function (hbs) {
	var hbsutils = require('hbs-utils')(hbs);
	var registerPartial = config.server.production ? 'registerPartials' : 'registerWatchedPartials';

	hbsutils[registerPartial](config.nitro.base_path + config.nitro.view_partials_directory, {
		match: partialMatch,
		name: function(template) {
			// fix template path for subfolders on windows
			return template.replace(/\\/g, '/');
		}
	});
};
