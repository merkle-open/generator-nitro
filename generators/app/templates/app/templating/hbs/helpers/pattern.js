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
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const config = require('config');
const hbsUtils = require('../utils');
const lint = require('../../../lib/lint');
const htmllintOptions = lint.getHtmllintOptions(true);

const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) => {
	const configKey = `nitro.patterns.${key}.path`;
	const patternPath = config.has(configKey) ? config.get(configKey) : false;
	return patternPath;
});

function getPattern(folder, templateFile, dataFile) {

	let pattern = null;

	// search base pattern
	patternBasePaths.forEach((patternBasePath) => {
		if (!pattern) {
			const templateFilePath = path.join(
				config.get('nitro.basePath'),
				patternBasePath,
				'/',
				folder,
				'/',
				`${templateFile}.${config.get('nitro.viewFileExtension')}`
			);
			const jsonFilePath = path.join(
				config.get('nitro.basePath'),
				patternBasePath,
				'/',
				folder,
				'/_data/',
				`${dataFile}.json`
			);
			const schemaFilePath = path.join(
				config.get('nitro.basePath'),
				patternBasePath,
				'/',
				folder,
				'/',
				'schema.json'
			);

			if (fs.existsSync(templateFilePath)) {
				pattern = {
					templateFilePath,
					jsonFilePath,
					schemaFilePath,
				};
			}
		}
	});

	// maybe its an element...
	if (!pattern) {

		const elementGlobs = patternBasePaths.map((patternBasePath) => {
			return `${patternBasePath}/*/elements/${folder}/${templateFile}.${config.get('nitro.viewFileExtension')}`;
		});

		globby.sync(elementGlobs).forEach((templatePath) => {
			if (pattern) {
				throw new Error(`You have multiple elements defined with the name \`${folder}\``);
			} else {
				pattern = {
					templateFilePath: templatePath,
					jsonFilePath: path.join(
						path.dirname(templatePath),
						'/_data/',
						`${dataFile}.json`
					),
					schemaFilePath: path.join(
						path.dirname(templatePath),
						'schema.json'
					),
				};
			}
		});
	}

	return pattern;
}

module.exports = function pattern() {

	try {
		const context = arguments[arguments.length - 1];
		const contextDataRoot = context.data && context.data.root ? context.data.root : {};    // default pattern data from controller & view
		const name = typeof arguments[0] === 'string' ? arguments[0] : context.hash.name;
		const folder = name.replace(/[^A-Za-z0-9-]/g, '');
		const templateFile = context.hash && context.hash.template ? context.hash.template : folder.toLowerCase();

		let dataFile = folder.toLowerCase();                                                   // default data file
		let passedData = null;                                                                 // passed data to pattern helper
		const patternData = {};                                                                // collected pattern data

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
				} else if (fs.existsSync(pattern.jsonFilePath)) {
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

				// Validate with JSON schema
				if (!config.get('server.production') && config.get('code.validation.jsonSchema.live')) {
					if (fs.existsSync(pattern.schemaFilePath)) {
						const schema = JSON.parse(fs.readFileSync(pattern.schemaFilePath, 'utf8'));
						const valid = ajv.validate(schema, patternData);
						if (!valid) {
							throw new Error(`JSON Schema: ${ajv.errorsText()}`);
						}
					}
				}

				const html = hbs.handlebars.compile(
					fs.readFileSync(pattern.templateFilePath, 'utf8')
				)(patternData, context);

				// lint html snippet
				if (!config.get('server.production') && config.get('code.validation.htmllint.live')) {
					lint.lintSnippet(pattern.templateFilePath, html, htmllintOptions);
				}

				return new hbs.handlebars.SafeString(html);

			} catch (e) {
				throw new Error(`Parse Error in Pattern ${name}: ${e.message}`);
			}
		}

		throw new Error(`Pattern \`${name}\` with template file \`${templateFile}.${config.get('nitro.viewFileExtension')}\` not found in folder \`${folder}\`.`);

	} catch (e) {
		return hbsUtils.logAndRenderError(e);
	}
};
