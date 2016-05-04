var fs = require('fs');
var path = require('path');
var config = require('./config');<% if (options.templateEngine === 'twig') { %>
var twig = require('twig');

function logAndRenderError(e) {
	console.info(e.message);
	return twig({
		data: '<p class="nitro-msg nitro-msg--error">' + e.message + '</p>',
	}).render();
}<% } %><% if (options.templateEngine === 'handlebars') {%>
var hbs = require('hbs');

function logAndRenderError(e) {
	console.info(e.message);
	return new hbs.handlebars.SafeString(
		'<p class="nitro-msg nitro-msg--error">' + e.message + '</p>'
	);
}<% } %>

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

function _findDirectoryByComponentName(name) {
	for (var key in config.nitro.components) {
		if (config.nitro.components.hasOwnProperty(key)) {
			var component = config.nitro.components[key];
			if (component.hasOwnProperty('path')) {
				var templateDirectory = path.join(
					component.path,
					'/',
					name
				);

				var templatePath = path.join(
					templateDirectory,
					'/',
					name.toLowerCase() + '.' + config.nitro.view_file_extension
				);

				if (fileExistsSync(templatePath)) {
					return templateDirectory;
				}
			}
		}
	}

	throw new Error('Component Directory Not Found');
}

function findTemplate(name) {
	try {
		return path.join(
			_findDirectoryByComponentName(name),
			'/',
			name.toLowerCase() + '.' + config.nitro.view_file_extension
		);
	} catch (e) {
		throw new Error('No Valid Template Found');
	}
}

function getDataJSON(name, variant) {
	var DATA_DIR = '_data';

	var fileName = (!!variant)
		? variant.concat('.json')
		: name.toLowerCase().concat('.json');

	try {
		var componentDir = _findDirectoryByComponentName(name);
		var dataFilePath = path.join(
			componentDir,
			'/',
			DATA_DIR,
			fileName
		);

		if (!fileExistsSync(dataFilePath)) {
			throw new Error('Not Data File ' + fileName + ' Found');
		}

		return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

	} catch (e) {
		throw e;
	}
}

module.exports = {
	fileExistsSync: fileExistsSync,
	logAndRenderError: logAndRenderError,
	findTemplate: findTemplate,
	getDataJSON: getDataJSON
};
