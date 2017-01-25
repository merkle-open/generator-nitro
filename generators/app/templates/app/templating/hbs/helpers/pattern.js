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
const globby = require('globby');
const config = require('../../../core/config');
const hbsUtils = require('../utils');
const lint = require('../../../lib/lint');
const htmllintOptions = lint.getHtmllintOptions(true);

const patternBasePaths = Object.keys(config.nitro.patterns).map((key) => {
	return config.nitro.patterns[key].path;
});

function getPattern(folder, templateFile, dataFile) {

	let pattern = null;

	// search base pattern
	patternBasePaths.forEach((patternBasePath) => {
		if (!pattern) {
			const templateFilePath = path.join(
				config.nitro.base_path,
				patternBasePath,
				'/',
				folder,
				'/',
				`${templateFile}.${config.nitro.view_file_extension}`
			);
			const jsonFilePath = path.join(
				config.nitro.base_path,
				patternBasePath,
				'/',
				folder,
				'/_data/',
				`${dataFile}.json`
			);

			if (fs.existsSync(templateFilePath)) {
				pattern = {
					templateFilePath: templateFilePath,
					jsonFilePath: jsonFilePath,
				}
			}
		}
	});

	// maybe its an element...
	if (!pattern) {

		const elementGlobs = patternBasePaths.map((patternBasePath) => {
			return `${patternBasePath}/*/elements/${folder}/${templateFile}.${config.nitro.view_file_extension}`;
		});

		globby.sync(elementGlobs).forEach((templatePath) => {
			if (pattern) {
				throw new Error(`You have multiple elements defined with the name \`${folder}\``);
			} else {
				pattern =  {
					templateFilePath: templatePath,
					jsonFilePath: path.join(
						path.dirname(templatePath),
						'/_data/',
						`${dataFile}.json`
					)
				}
			}
		});
	}

	return pattern;
}

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

		const pattern = getPattern(folder, templateFile, dataFile);
		if (pattern) {
			try {
				if (contextDataRoot._locals) {
					extend(true, patternData, contextDataRoot._locals);
				}

				if (passedData) {
					extend(true, patternData, passedData);
				}
				else if (fs.existsSync(pattern.jsonFilePath)) {
					extend(true, patternData, JSON.parse(fs.readFileSync(pattern.jsonFilePath, 'utf8')));
				}

				if (contextDataRoot._query) {
					extend(true, patternData, contextDataRoot._query);
				}

				// Add attribtues e.g. "disabled" of {{pattern "button" disabled=true}}
				if (context.hash) {
					extend(true, patternData, context.hash);
				}

				// Add children e.g. {{#pattern "button"}}Click me{{/pattern}}
				if (context.fn) {
					patternData.children = context.fn(this);
				}

				const html = hbs.handlebars.compile(
					fs.readFileSync(pattern.templateFilePath, 'utf8')
				)(patternData, context);

				// lint html snippet
				if (!config.server.production) {
					lint.lintSnippet(pattern.templateFilePath, html, htmllintOptions);
				}

				return new hbs.handlebars.SafeString(html);
			}
			catch (e) {
				throw new Error(`Parse Error in Pattern ${name}: ${e.message}`);
			}
		}

		throw new Error(`Pattern \`${name}\` with template file \`${templateFile}.${config.nitro.view_file_extension}\` not found in folder \`${folder}\`.`);
	}
	catch (e) {
		return hbsUtils.logAndRenderError(e);
	}
};
