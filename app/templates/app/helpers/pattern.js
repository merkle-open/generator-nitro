'use strict';

/**
 * handlebars helper: {{pattern PatternName Data Variation}}
 *
 * Usage
 * {{pattern 'button' 'button-fancy'}}
 * {{pattern name='button' data='button-fancy'}}
 *
 * Usage (passing arguments)
 * {{pattern name='button' disabled=true}}
 *
 * Usage (with children)
 * {{#pattern name='button'}}Click Me{{/pattern}}
 * {{#pattern name='button' disabled=true}}Not Clickable{{/pattern}}
 *
 */
const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const extend = require('extend');
const config = require('../core/config');
const utils = require('../core/utils');

module.exports = function pattern () {

	try {
		const context = arguments[arguments.length - 1];
		const contextDataRoot = context.data && context.data.root ? context.data.root : {};    // default pattern data from controller & view
		const name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name;
		const folder = name.replace(/[^A-Za-z0-9-]/g, '');
		const templateFile = context.hash && context.hash.template ? context.hash.template : folder.toLowerCase();
		let dataFile = folder.toLowerCase();                                                   // default data file
		let passedData = null;                                                                 // passed data to pattern helper
		let patternData = {};                                                                  // collected pattern data

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

		for (let key in config.nitro.patterns) {
			if (config.nitro.patterns.hasOwnProperty(key)) {
				var pattern = config.nitro.patterns[key];
				if (pattern.hasOwnProperty('path')) {
					const templatePath = path.join(
						config.nitro.base_path,
						pattern.path,
						'/',
						folder,
						'/',
						`${templateFile}.${config.nitro.view_file_extension}`
					);

					if (utils.fileExistsSync(templatePath)) {
						const jsonFilename = `${dataFile}.json`;
						const jsonPath = path.join(
							config.nitro.base_path,
							pattern.path,
							'/',
							folder,
							'/_data/',
							jsonFilename
						);

						try {
							if (contextDataRoot._locals) {
								extend(true, patternData, contextDataRoot._locals);
							}

							if (passedData) {
								extend(true, patternData, passedData);
							}
							else if (utils.fileExistsSync(jsonPath)) {
								extend(true, patternData, JSON.parse(fs.readFileSync(jsonPath, 'utf8')));
							}

							if (contextDataRoot._query) {
								extend(true, patternData, contextDataRoot._query);
							}

							// Add attribtues e.g. "disabled" of {{pattern "Button" disabled=true}}
							if (context.hash) {
								extend(true, patternData, context.hash);
							}

							// Add children e.g. {{#pattern "Button"}}Click me{{/pattern}}
							if (context.fn) {
								patternData.children = context.fn(this);
							}

							return new hbs.handlebars.SafeString(
								hbs.handlebars.compile(
									fs.readFileSync(templatePath, 'utf8')
								)(patternData, context)
							);
						}
						catch (e) {
							throw new Error(`Parse Error in Pattern ${name}: ${e.message}`);
						}
					}
				}
			}
		}

		throw new Error(`Pattern \`${name}\` with template file \`${templateFile}.${config.nitro.view_file_extension}\` not found in folder \`${folder}\`.`);
	}
	catch (e) {
		return utils.logAndRenderError(e);
	}
};
