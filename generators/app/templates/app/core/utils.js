'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');

function getLayoutPath(layoutName) {
	const layoutPath = `${config.nitro.view_layouts_directory.replace(config.nitro.view_directory + '/', '')}/${layoutName}`;
	return layoutPath;
}

function layoutExists(layoutName) {
	const layoutPath = path.join(
		config.nitro.base_path,
		config.nitro.view_layouts_directory,
		`/${layoutName}.${config.nitro.view_file_extension}`
	);
	return fs.existsSync(layoutPath);
}

module.exports = {
	getLayoutPath,
	layoutExists
};
