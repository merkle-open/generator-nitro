'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../core/config');

const viewExcludes = {
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

const replaceAt = function replaceAt(string, index, character) {
	return string.substr(0, index) + character + string.substr(index + character.length);
};

/**
 * @typedef {Object} View
 * @property {string} name View name
 * @property {string} url View url
 */

/**
 * get all views
 * @param dir string to-be-traversed directory
 * @returns {View} an array of views
 */
function getViews(dir) {
	let results = [];
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = dir + '/' + file;
		const stat = fs.statSync(filePath);

		if (file.substring(0,1) === '.') {}
		else if (stat && stat.isDirectory() && viewExcludes.directories.indexOf(file) === -1) {
			results = results.concat(getViews(filePath));
		}
		else if (stat && stat.isFile() && viewExcludes.files.indexOf(file) === -1) {
			const relativePath = path.relative(config.nitro.base_path + config.nitro.view_directory, filePath);
			const ext = path.extname(filePath);
			const extReg = new RegExp(ext + '$');
			const name = relativePath.replace(extReg, '').replace(/\//g, ' ').replace(/\\/g, ' ').replace(/\b\w/g, (w) => {
				return w.toUpperCase();
			});
			const url = relativePath.replace(extReg, '').replace(/\//g, '-').replace(/\\/g, '-');

			results.push({name, url});
		}
	});

	return results;
}

/**
 * get possible view paths
 * @param action The requested route (e.g. content-example)
 * @returns {Array} array of strings of possible paths to view files (e.g. content-example, content/example)
 */
function getViewCombinations(action) {
	const pathes = [action];
	let positions = [];
	let i, j;

	for (i = 0; i < action.length; i++) {
		if (action[i] === '-') {
			positions.push(i);
		}
	}

	const len = positions.length;
	let combinations = [];

	for (i = 1; i < ( 1 << len ); i++) {
		let c = [];
		for (j = 0; j < len; j++) {
			if (i & ( 1 << j )) {
				c.push(positions[j]);
			}
		}
		combinations.push(c);
	}

	combinations.forEach((combination) => {
		let path = action;
		combination.forEach((pos) => {
			path = replaceAt(path, pos, '/');
		});
		pathes.push(path);
	});
	return pathes;
}

module.exports = {
	getViews,
	getViewCombinations
};
