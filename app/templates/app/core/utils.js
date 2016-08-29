var fs = require('fs');
var hbs = require('hbs');
var path = require('path');
var config = require('./config');

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
		'<p class="nitro-msg nitro-msg--error">' + e.message + '</p>'
	);
}

function layoutExists(layoutName) {
	var layoutPath = path.join(
		config.nitro.base_path,
		config.nitro.view_layouts_directory,
		'/' + layoutName + '.' + config.nitro.view_file_extension
	);
	return fileExistsSync(layoutPath);
}

function getLayoutPath(layoutName) {
	var layoutPath = config.nitro.view_layouts_directory.replace(config.nitro.view_directory + '/', '') + '/' + layoutName;
	return layoutPath;
}

module.exports = {
	fileExistsSync: fileExistsSync,
	logAndRenderError: logAndRenderError,
	layoutExists: layoutExists,
	getLayoutPath: getLayoutPath
};
