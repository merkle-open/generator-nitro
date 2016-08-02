var fs = require('fs');
var hbs = require('hbs');
var path = require('path');
var extend = require('extend');
var cfg = require('../../app/core/config.js');
var utils = require('../core/utils');

module.exports = function () {

	try {
		var context = arguments[arguments.length - 1];
		var contextDataRoot = context.data && context.data.root ? context.data.root : {};
		var name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name;
		var templateFile = 'string' === typeof arguments[1] ? arguments[1] : context.hash.template;
		var placeholderData = {};

		// validate
		if(!name) {
			throw new Error('Placeholder name parameter not set');
		}

		if(!templateFile) {
			throw new Error('Placeholder template parameter not set');
		}

		// data
		if (contextDataRoot._locals) {
			extend(true, placeholderData, contextDataRoot._locals);
		}

		if (contextDataRoot._query) {
			extend(true, placeholderData, contextDataRoot._query);
		}

		templateFile += '.' + cfg.nitro.view_file_extension;

		var templatePath = path.join(
			cfg.nitro.base_path,
			cfg.nitro.placeholders_directory,
			name,
			templateFile);

		if (utils.fileExistsSync(templatePath)) {
			return new hbs.handlebars.SafeString(
				hbs.handlebars.compile(
					fs.readFileSync(templatePath, 'utf8')
				)(placeholderData, context)
			);
		}

		throw new Error('Placeholder ' + templatePath + ' not found.');

	}
	catch (e) {
		return utils.logAndRenderError(e);
	}
};
