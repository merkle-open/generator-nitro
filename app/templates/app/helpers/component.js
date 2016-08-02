/**
 * handlebars helper: {{component ComponentName Data Variation}}
 *
 * Usage
 * {{component 'button' 'button-fancy'}}
 * {{component name='button' data='button-fancy'}}
 *
 * Usage (passing arguments)
 * {{component name='button' disabled=true}}
 *
 * Usage (with children)
 * {{#component name='button'}}Click Me{{/component}}
 * {{#component name='button' disabled=true}}Not Clickable{{/component}}
 *
 */
var fs = require('fs');
var hbs = require('hbs');
var path = require('path');
var extend = require('extend');
var cfg = require('../core/config');
var utils = require('../core/utils');

module.exports = function component () {

	try {
		var context = arguments[arguments.length - 1];
		var contextDataRoot = context.data && context.data.root ? context.data.root : {};      // default component data from controller & view
		var name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name;
		var folder = name.replace(/[^A-Za-z0-9-]/g, '');
		var templateFile = context.hash && context.hash.template ? context.hash.template : folder.toLowerCase();
		var dataFile = folder.toLowerCase();                                                   // default data file
		var passedData = null;                                                                 // passed data to component helper
		var componentData = {};                                                                // collected component data

		if (arguments.length >= 3) {
			switch (typeof arguments[1]) {
				case 'string':
					dataFile = arguments[1].replace(/\.json$/i, '').toLowerCase();
					break;
				case 'object':
					passedData = extend(true, passedData, arguments[1]);
					break;
				case 'number':
				case 'boolean':
					passedData = arguments[1];
					break;
				default:
					break;
			}
		}
		if (context.hash && context.hash.data) {
			switch (typeof context.hash.data) {
				case 'string':
					dataFile = context.hash.data.replace(/\.json$/i, '').toLowerCase();
					break;
				case 'object':
					passedData = extend(true, passedData, context.hash.data);
					break;
				case 'number':
				case 'boolean':
					passedData = context.hash.data;
					break;
				default:
					break;
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

							// Add attribtues e.g. "disabled" of {{component "Button" disabled=true}}
							if (context.hash) {
								extend(true, componentData, context.hash);
							}

							// Add children e.g. {{#component "Button"}}Click me{{/component}}
							if (context.fn) {
								componentData.children = context.fn(this);
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
		return utils.logAndRenderError(e);
	}
};
