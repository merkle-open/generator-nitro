var hbs = require('hbs');
var fs = require('fs');
var path = require('path');
var cfg = require('../core/config.js');

/**
 * Excluded Directories and Files
 * @type {{directories: *[], files: *[]}}
 */
var excludes = {
	directories: [
		path.basename(cfg.nitro.view_data_directory),
		path.basename(cfg.nitro.view_partials_directory),
		path.basename(cfg.nitro.placeholders_directory),
		'.svn'
	],
	files: [
		'404.' + cfg.nitro.view_file_extension,
		'.DS_Store',
		'Thumbs.db',
		'Desktop.ini'
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
		var filePath = dir + '/' + file;
		var stat = fs.statSync(filePath);

		if (stat && stat.isDirectory() && excludes.directories.indexOf(file) === -1) {
			results = results.concat(walk(filePath));
		}
		else if (stat && stat.isFile() && excludes.files.indexOf(file) === -1) {
			var relativePath = path.relative(cfg.nitro.base_path + cfg.nitro.view_directory, filePath);
			var ext = path.extname(filePath);
			var extReg = new RegExp(ext + '$');
			var name = relativePath.replace(extReg, '').replace(/\//g, ' ').replace(/\\/g, ' ').replace(/\b\w/g, function (w) {
					return w.toUpperCase();
				});
			var url = relativePath.replace(extReg, '').replace(/\//g, '-').replace(/\\/g, '-');

			results.push({
				view_name: name,
				view_url: url
			});
		}
	});

	return results;
}

module.exports = function() {
	var views = walk(cfg.nitro.base_path + cfg.nitro.view_directory);
	var markup = ['<ul>'];

	views.forEach(function(view) {
		markup.push('<li><a href="/' + view.view_url + '">' + view.view_name + '</a></li>');
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
