'use strict';

const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const config = require('../../../core/config.js');

/**
 * Excluded Directories and Files
 * @type {{directories: *[], files: *[]}}
 */
const excludes = {
	directories: [
		path.basename(config.nitro.view_data_directory),
		path.basename(config.nitro.view_partials_directory),
		path.basename(config.nitro.view_layouts_directory),
		path.basename(config.nitro.placeholders_directory),
		'.svn'
	],
	files: [
		'404.' + config.nitro.view_file_extension,
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
	let results = [];
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = dir + '/' + file;
		const stat = fs.statSync(filePath);

		if (stat && stat.isDirectory() && excludes.directories.indexOf(file) === -1) {
			results = results.concat(walk(filePath));
		}
		else if (stat && stat.isFile() && excludes.files.indexOf(file) === -1) {
			const relativePath = path.relative(config.nitro.base_path + config.nitro.view_directory, filePath);
			const ext = path.extname(filePath);
			const extReg = new RegExp(ext + '$');
			const name = relativePath.replace(extReg, '').replace(/\//g, ' ').replace(/\\/g, ' ').replace(/\b\w/g, (w) => {
					return w.toUpperCase();
				});
			const url = relativePath.replace(extReg, '').replace(/\//g, '-').replace(/\\/g, '-');

			results.push({
				view_name: name,
				view_url: url
			});
		}
	});

	return results;
}

module.exports = function view_list () {
	const views = walk(config.nitro.base_path + config.nitro.view_directory);
	let markup = ['<ul>'];

	views.forEach((view) => {
		markup.push(`<li><a href="/${view.view_url}">${view.view_name}</a></li>`);
	});

	markup.push('</ul>');

	return new hbs.handlebars.SafeString(markup.join(''));
};
