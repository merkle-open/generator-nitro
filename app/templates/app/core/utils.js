var fs = require('fs');
var hbs = require('hbs');

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

module.exports = {
	fileExistsSync: fileExistsSync,
	logAndRenderError: logAndRenderError
};
