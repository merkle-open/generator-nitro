var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	extend = require('extend'),
	cfg = require('../core/config.js');

module.exports = function () {

	var logAndRenderError = function logAndRenderError(e) {
		console.info(e.message);
		return new hbs.handlebars.SafeString(
			'<p class="nitro-msg nitro-msg--error" style="padding:1rem;text-align:center;background-color:rgba(200,0,0,.2);background-image:repeating-linear-gradient(315deg ,transparent, transparent 25px, rgba(200,0,0,.3) 25px, rgba(200,0,0,.3) 50px);">' + e.message + '</p>'
		);
	};
	var fileExistsSync = function fileExistsSync(filename) {
		// Substitution for the deprecated fs.existsSync() method @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
		try {
			fs.accessSync(filename);
			return true;
		}
		catch (ex) {
			return false;
		}
	};

	try {
		var context = arguments[arguments.length - 1],
			contextDataRoot = context && context.data && context.data.root ? context.data.root : {},            // default component data from controller & view
			name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name,
			templateFile = context.hash.template || name.replace(/\s/g, '').replace(/-/g, '').toLowerCase(),
			dataFile = name.replace(/\s/g, '').replace(/-/g, '').toLowerCase(),                                 // default data file
			passedData = null,                                                                                  // passed data to component helper
			componentData = {};                                                                                 // collected component data

		if (arguments.length >= 3) {
			if ('object' === typeof arguments[1]) {
				passedData = arguments[1];
			}
			else if('string' === typeof arguments[1]) {
				dataFile = arguments[1].replace(/\.json$/i, '').toLowerCase();
			}
		}
		else if (context.hash.data) {
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
						name,
						'/',
						templateFile + '.' + cfg.nitro.view_file_extension
					);

					if (fileExistsSync(templatePath)) {
						var jsonFilename = dataFile + '.json',
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

							if (passedData) {
								extend(true, componentData, passedData);
							}
							else if (fileExistsSync(jsonPath)) {
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

		throw new Error('Component ' + name + ' not found.');
	}
	catch (e) {
		return logAndRenderError(e);
	}
};
