var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	extend = require('extend'),
	cfg = require('../core/config'),
	utils = require('../core/utils');

module.exports = function () {

	var logAndRenderError = function logAndRenderError(e) {
		console.info(e.message);
		return new hbs.handlebars.SafeString(
			'<p class="nitro-msg nitro-msg--error">' + e.message + '</p>'
		);
	};

	try {
		var context = arguments[arguments.length - 1],
			contextDataRoot = context.data && context.data.root ? context.data.root : {},   // default component data from controller & view
			name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name,
			folder = name.replace(/[^A-Za-z0-9-]/g, ''),
			templateFile = context.hash && context.hash.template ? context.hash.template : folder.toLowerCase(),
			dataFile = folder.toLowerCase(),                                                           // default data file
			passedData = null,                                                                         // passed data to component helper
			componentData = {};                                                                        // collected component data

		if (arguments.length >= 3) {
			if ('object' === typeof arguments[1]) {
				passedData = arguments[1];
			}
			else if('string' === typeof arguments[1]) {
				dataFile = arguments[1].replace(/\.json$/i, '').toLowerCase();
			}
		}
		else if (context.hash && context.hash.data) {
			if ('object' === typeof context.hash.data) {
				passedData = context.hash.data;
			}
			else if ('string' === typeof context.hash.data) {
				dataFile = context.hash.data;
			}
		}

		for (var key in cfg.nitro.components) {
			if (cfg.nitro.components.hasOwnProperty(key)) {
				var component = cfg.nitro.components[key];
				if (component.hasOwnProperty('path')) {
					var templatePath = path.join(
						cfg.nitro.base_path,
						component.path,
						'/',
						folder,
						'/',
						templateFile + '.' + cfg.nitro.view_file_extension
					);

					if (utils.fileExistsSync(templatePath)) {
						var jsonFilename = dataFile + '.json',
							jsonPath = path.join(
								cfg.nitro.base_path,
								component.path,
								'/',
								folder,
								'/_data/',
								jsonFilename
							);

						try {
							if (contextDataRoot._locals) {
								extend(true, componentData, contextDataRoot._locals);
							}

							if (passedData) {
								extend(true, componentData, passedData);
							}
							else if (utils.fileExistsSync(jsonPath)) {
								extend(true, componentData, JSON.parse(fs.readFileSync(jsonPath, 'utf8')));
							}

							if (contextDataRoot._query) {
								extend(true, componentData, contextDataRoot._query);
							}

							return new hbs.handlebars.SafeString(
								hbs.handlebars.compile(
									fs.readFileSync(templatePath, 'utf8')
								)(componentData, context)
							);
						}
						catch (e) {
							throw new Error('Parse Error in Component ' + name + ': ' + e.message);
						}
					}
				}
			}
		}

		throw new Error('Component `' + name + '` with template file `'+ templateFile + '.' + cfg.nitro.view_file_extension + '` not found in folder `' + folder + '`.');
	}
	catch (e) {
		return logAndRenderError(e);
	}
};
