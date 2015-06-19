var hbs = require('hbs'),
	fs = require('fs'),
	path = require('path'),
	cfg = require('../core/config.js');

/**
 * Excluded Directories and Files
 * @type {{directories: *[], files: *[]}}
 */
var excludes = {
	directories: [
		'_data',
		path.basename(cfg.nitro.view_partials_directory)
	],
	files: [
		'404.' + cfg.nitro.view_file_extension
	]
};

/**
 *
 * @param dir string To-be-traversed Directory
 * @returns {Array} All allowed views
 */
function walk(dir) {
	var results = [];

	var files = fs.readdirSync(dir);
	files.forEach(function(file) {
		var filePath = dir + '/' + file,
			stat = fs.statSync(filePath);

		if (stat && stat.isDirectory() && excludes.directories.indexOf(file) === -1) {
			results = results.concat(walk(filePath));
		} else if (stat && stat.isFile() && excludes.files.indexOf(file) === -1) {
			var name = path.basename(file, '.' + cfg.nitro.view_file_extension),
				relativePath = path.relative(cfg.nitro.view_directory, filePath),
				url = relativePath.toLowerCase().replace(/\//g, '-'),
				extLength = path.extname(url).length;

			url = url.substring(0, url.length - extLength);

			results.push({
				view_name: name,
				view_url: url
			});
		}
	});

	return results;
}

module.exports = function() {
	var views = walk(cfg.nitro.view_directory),
		markup = ['<ul>'];

	views.forEach(function(view) {
		markup.push('<li><a href="' + view.view_url + '">' + view.view_name + '</a></li>');
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};