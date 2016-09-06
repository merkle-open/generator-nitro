'use strict';

const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const config = require('./config');

function fileExistsSync(filename) {
	// Substitution for the deprecated fs.existsSync() method @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
	try {
		fs.accessSync(filename);
		return true;
	}
	catch (ex) {
		return false;
	}
}

function logAndRenderError(e) {
	console.info(e.message);
	return new hbs.handlebars.SafeString(
		`<p class="nitro-msg nitro-msg--error">${e.message}</p>`
	);
}

function layoutExists(layoutName) {
	const layoutPath = path.join(
		config.nitro.base_path,
		config.nitro.view_layouts_directory,
		`/${layoutName}.${config.nitro.view_file_extension}`
	);
	return fileExistsSync(layoutPath);
}

function getLayoutPath(layoutName) {
	const layoutPath = `${config.nitro.view_layouts_directory.replace(config.nitro.view_directory + '/', '')}/${layoutName}`;
	return layoutPath;
}

module.exports = {
	fileExistsSync,
	logAndRenderError,
	layoutExists,
	getLayoutPath
};
