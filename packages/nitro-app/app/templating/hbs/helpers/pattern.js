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

function getPatternBasePaths(type) {
	let patternTypeKeys;

	if (type) {
		// if a type is given, only return pattern types which match the given type, should just be one type
		patternTypeKeys = Object.keys(config.get('nitro.patterns')).filter((key) => {
			return config.get('nitro.patterns')[key].path.indexOf(type) >= 0;
		});

		if (patternTypeKeys.length === 0) {
			throw new Error(`Pattern type \`${type}\` not found in pattern config.`);
		}
	} else {
		patternTypeKeys = Object.keys(config.get('nitro.patterns'));
	}

	return patternTypeKeys.map((key) => {
		const configKey = `nitro.patterns.${key}.path`;
		return config.has(configKey) ? config.get(configKey) : false;
	});
}

function getPattern(folder, templateFile, dataFile, type) {
	const patternBasePaths = getPatternBasePaths(type);
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
			if (!pattern) {
				pattern = {
					templateFilePath: templatePath,
					jsonFilePath: path.join(path.dirname(templatePath), '/_data/', `${dataFile}.json`),
					schemaFilePath: path.join(path.dirname(templatePath), 'schema.json'),
				};
			}
		});
	}

	return pattern;
}

module.exports = function () {
	try {
		const context = arguments[arguments.length - 1];
		const contextDataRoot = context.data && context.data.root ? context.data.root : {}; // default pattern data from controller & view
		const name = typeof arguments[0] === 'string' ? arguments[0] : context.hash.name;
		const folder = name.replace(/[^A-Za-z0-9-]/g, '');
		const templateFile = context.hash && context.hash.template ? context.hash.template : folder.toLowerCase();
		const type = context.hash && context.hash.type ? context.hash.type : '';

		let dataFile = folder.toLowerCase(); // default data file
		let passedData = null; // passed data to pattern helper
		const patternData = {}; // collected pattern data

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

		const pattern = getPattern(folder, templateFile, dataFile, type);
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

				// Add attributes e.g. "disabled" of {{pattern "button" disabled=true}}
				if (context.hash) {
					extend(true, patternData, context.hash);
				}

				// Add children e.g. {{#pattern "button"}}Click me{{/pattern}}
				if (context.fn) {
					patternData.children = context.fn(this);
				}


				// Validate with JSON schema
				/* eslint-disable max-depth */
				if (!config.get('server.production') && config.get('code.validation.jsonSchema.live')) {
					if (fs.existsSync(pattern.schemaFilePath)) {
						const schema = JSON.parse(fs.readFileSync(pattern.schemaFilePath, 'utf8'));
						if (schema.$id) {
							// remove if already known to avoid collision
							if (ajv.getSchema(schema.$id)) {
								ajv.removeSchema(schema);
							}
						}
						const valid = ajv.validate(schema, patternData);
						if (!valid) {
							throw new Error(`JSON Schema: ${ajv.errorsText()}`);
						}
					}
				}
				/* eslint-enable max-depth */

				const html = hbs.handlebars.compile(fs.readFileSync(pattern.templateFilePath, 'utf8'))(
					patternData,
					context
				);

				// lint html snippet
				if (!config.get('server.production') && config.get('code.validation.htmllint.live')) {
					lint.lintSnippet(pattern.templateFilePath, html, htmllintOptions);
				}

				return new hbs.handlebars.SafeString(html);
			} catch (e) {
				throw new Error(`Parse Error in Pattern ${name}: ${e.message}`);
			}
		}

		throw new Error(
			`Pattern \`${name}\`${
				type ? ` within pattern type \`${type}\`` : ''
			} with template file \`${templateFile}.${config.get(
				'nitro.viewFileExtension'
			)}\` not found in folder \`${folder}\`.`
		);
	} catch (e) {
		return hbsUtils.logAndRenderError(e);
	}
};
