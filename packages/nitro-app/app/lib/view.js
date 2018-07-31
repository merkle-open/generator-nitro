'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');

const viewExcludes = {
	directories: [
		path.basename(config.get('nitro.viewDataDirectory')),
		path.basename(config.get('nitro.viewPartialsDirectory')),
		path.basename(config.get('nitro.viewLayoutsDirectory')),
		path.basename(config.get('nitro.placeholdersDirectory')),
		'.svn',
	],
	files: [
		`404.${config.get('nitro.viewFileExtension')}`,
		'.DS_Store',
		'Thumbs.db',
		'Desktop.ini',
	],
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
		const filePath = `${dir}/${file}`;
		const stat = fs.statSync(filePath);

		if (file.substring(0, 1) === '.') {
			// do nothing
		} else if (stat && stat.isDirectory() && viewExcludes.directories.indexOf(file) === -1) {
			results = results.concat(getViews(filePath));
		} else if (stat && stat.isFile() && path.extname(file) === `.${config.get('nitro.viewFileExtension')}` && viewExcludes.files.indexOf(file) === -1) {
			const relativePath = path.relative(config.get('nitro.basePath') + config.get('nitro.viewDirectory'), filePath);
			const ext = path.extname(filePath);
			const extReg = new RegExp(`${ext}$`);
			const name = relativePath.replace(extReg, '').replace(/\//g, ' ').replace(/\\/g, ' ').replace(/\b\w/g, (w) => {
				return w.toUpperCase();
			});
			const url = relativePath.replace(extReg, '').replace(/\//g, '-').replace(/\\/g, '-');

			results.push({ name, url });
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
	const positions = [];
	let i;
	let j;

	for (i = 0; i < action.length; i++) {
		if (action[i] === '-') {
			positions.push(i);
		}
	}

	const len = positions.length;
	const combinations = [];

	for (i = 1; i < (1 << len); i++) {
		const c = [];
		for (j = 0; j < len; j++) {
			if (i & (1 << j)) {
				c.push(positions[j]);
			}
		}
		combinations.push(c);
	}

	combinations.forEach((combination) => {
		let combinationPath = action;
		combination.forEach((pos) => {
			combinationPath = replaceAt(combinationPath, pos, '/');
		});
		pathes.push(combinationPath);
	});
	return pathes;
}

module.exports = {
	getViews,
	getViewCombinations,
};
