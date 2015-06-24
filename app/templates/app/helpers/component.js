var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	extend = require('extend'),
	cfg = require('../core/config.js');

module.exports = function (name, data) {

	var context = arguments[arguments.length - 1],
		contextDataRoot = context && context.data ? context.data.root : {}, // default component data from controller & view
		componentData = {};

	for (var key in cfg.nitro.components) {
		if (cfg.nitro.components.hasOwnProperty(key)) {
			var component = cfg.nitro.components[key];
			if (component.hasOwnProperty('path')) {
				var templateFilename = name.toLowerCase(),
					templatePath = path.join(
						cfg.nitro.base_path,
						component.path,
						'/',
						name,
						'/',
						templateFilename + '.' + cfg.nitro.view_file_extension
					);

				if (fs.existsSync(templatePath)) { // TODO: existsSynch marked as deprecated - https://nodejs.org/api/fs.html#fs_fs_existssync_path
					var jsonFilename = ('string' === typeof data) ? data.toLowerCase() + '.json' : templateFilename + '.json',
						jsonPath = path.join(
							cfg.nitro.base_path,
							component.path,
							'/',
							name,
							'/_data/',
							jsonFilename
						);

					if (contextDataRoot._locals) {
						extend(true, componentData, contextDataRoot._locals);
					}

					if (fs.existsSync(jsonPath)) {
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
			}
		}
	}

	throw new Error('Component ' + name + ' not found.');
};
