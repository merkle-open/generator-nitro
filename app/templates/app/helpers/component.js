var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	extend = require('extend'),
	cfg = require('../core/config.js');

function logAndRenderError(e) {
	console.info(e.message);
	return new hbs.handlebars.SafeString(
		'<p class="t-nitro-error">' + e.message +'</p>'
	);
}

module.exports = function (name, data) {
	try {
		var context = arguments[arguments.length - 1],
			contextDataRoot = context && context.data ? context.data.root : {}, // default component data from controller & view
			componentData = {},
			fileExistsSync = function fileExistsSync(filename) {
				// Fix for the deprecation of the fs.existsSync() method
				// @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
				try {
					fs.accessSync(filename);
					return true;
				} catch(ex) {
					return false;
				}
			};

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

					if (fileExistsSync(templatePath)) {
						var jsonFilename = ('string' === typeof data) ? data.toLowerCase() + '.json' : templateFilename + '.json',
							jsonPath = path.join(
								cfg.nitro.base_path,
								component.path,
								'/',
								name,
								'/_data/',
								jsonFilename
							);

						try {
							if (contextDataRoot._locals) {
								extend(true, componentData, contextDataRoot._locals);
							}

							if (fileExistsSync(jsonPath)) {
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

							template;
						} catch(e) {
							throw new Error('Parse Error in Component ' + name + ': ' + e.message);
						}

					}
				}
			}
		}

		throw new Error('Component ' + name + ' not found.');
	} catch(e) {
		return logAndRenderError(e);
	}
};
