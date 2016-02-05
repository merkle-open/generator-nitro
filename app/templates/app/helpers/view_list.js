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
		path.basename(cfg.nitro.view_data_directory),
		path.basename(cfg.nitro.view_partials_directory),
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
	var results = [],
		files = fs.readdirSync(dir);

	files.forEach(function(file) {
		var filePath = dir + '/' + file,
			stat = fs.statSync(filePath);

		if (stat && stat.isDirectory() && excludes.directories.indexOf(file) === -1) {
			results = results.concat(walk(filePath));
		}
		else if (stat && stat.isFile() && excludes.files.indexOf(file) === -1) {
			var relativePath = path.relative(cfg.nitro.base_path + cfg.nitro.view_directory, filePath),
				ext = path.extname(filePath),
				extReg = new RegExp(ext + '$'),
				name = relativePath.replace(extReg, '').replace(/\//g, ' ').replace(/\\/g, ' ').replace(/\b\w/g, function (w) {
					return w.toUpperCase();
				}),
				url = relativePath.replace(extReg, '').replace(/\//g, '-').replace(/\\/g, '-');

			results.push({
				view_name: name,
				view_url: url
			});
		}
	});

	return results;
}

module.exports = function() {
	var views = walk(cfg.nitro.base_path + cfg.nitro.view_directory),
		markup = ['<ul>'];

	views.forEach(function(view) {
		markup.push('<li><a href="/' + view.view_url + '">' + view.view_name + '</a></li>');
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
