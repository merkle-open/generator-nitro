var hbs = require('hbs'),
	fs = require('fs'),
	path = require('path'),
	cfg = require('../core/config.js');

module.exports = function() {
	var files = fs.readdirSync(cfg.nitro.view_directory);

	var markup = [];
	markup.push('<ul>');

	files.forEach(function(file) {
		var stat = fs.statSync(cfg.nitro.view_directory + '/' + file);

		if (stat.isFile()) {
			var view = path.basename(file, '.' + cfg.nitro.view_file_extension);
			markup.push(
				'<li><a href="' + view + '">' + view + '</a></li>'
			);
		}
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));

};