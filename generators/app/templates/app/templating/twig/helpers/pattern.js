'use strict';

/**
 * twig helper: {% pattern name='pattern-name' data='data-variation' template='template-variation' additionalData={ param1: 'value', param2: true } %}
 *
 * Usage
 * {% pattern name='button' data='button-fancy' %}
 *
 */

const fs = require('fs');
const path = require('path');
const extend = require('extend');
const globby = require('globby');
const Ajv = require('ajv');
const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
const config = require('config');
const twigUtils = require('../utils');
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


module.exports = function (Twig) {
	return {
		type: 'pattern',
		regex: /^pattern\s+(\w+='\S*')\s*(\w+='\S*')?\s*(\w+='\S*')?\s*([\S\s]+?)?$/,
		next: [],
		open: true,
		compile: function(token) {

			token.match.map((paramKeyValue, index) => {
				// our params are available in indexes 1-4
				if (index > 0 && index < 5) {

					// if the param in question is defined, we split the key=value pair and compile a twig expression
					if (paramKeyValue !== undefined) {
						const keyValueArray = paramKeyValue.split('=');
						let key = keyValueArray[0];
						const value = keyValueArray[1];

						token[key] = Twig.expression.compile.apply(this, [{
							type: Twig.expression.type.expression,
							value: value.trim()
						}]).stack;
					}
				}
			});

			delete token.match;

			return token;
		},
		parse: function(token, context, chain) {
			try {
				const name = Twig.expression.parse.apply(this, [token.name, context]);
				const folder = name.replace(/[^A-Za-z0-9-]/g, '');

				const patternData = {};                                                // collected pattern data
				let dataFile = folder.toLowerCase();                                   // default data file
				let passedData = undefined;                                            // passed data to pattern helper
				let passedDataParsed = undefined;                                      // passed data after parsing it
				let template;

				// check if data attribute was provided in pattern helper
				if (token.data !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					passedDataParsed = Twig.expression.parse.apply(this, [token.data, context]);
				}

				// check if template was provided in pattern helper
				let templateFile = folder.toLowerCase();
				if (token.template !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					templateFile = Twig.expression.parse.apply(this, [token.template, context]);
				}

				// check if additional data was provided in pattern helper
				let additionalData = null;
				if (token.additionalData !== undefined) {
					// calling Twig.expression.parse on undefined property through's an exception
					additionalData = Twig.expression.parse.apply(this, [token.additionalData, context]);
				}

				// check if a data parameter was provided in the pattern helper
				switch (typeof passedDataParsed) {
					case 'string':
						dataFile = passedDataParsed.replace(/\.json$/i, '').toLowerCase();
						break;
					case 'object':
						passedData = extend(true, passedData, passedDataParsed);
						break;
					case 'number':
					case 'boolean':
						passedData = passedDataParsed;
						break;
					default:
						break;
				}

				// get basic pattern information
				const pattern = getPattern(folder, templateFile, dataFile);

				if (pattern) {
					// merge global view data with patternData
					if (context._locals) {
						extend(true, patternData, context._locals);
					}

					// take passedData if it's defined or reade the default data json file
					if (passedData) {
						extend(true, patternData, passedData);
					} else if (fs.existsSync(pattern.jsonFilePath)) {
						extend(true, patternData, JSON.parse(fs.readFileSync(pattern.jsonFilePath, 'utf8')));
					}

					// merge query data with patternData
					if (context._query) {
						extend(true, patternData, context._query);
					}

					// Add additional attributes e.g. {% pattern name='button' additionalData={ disabled: true } %}
					if (additionalData !== null) {
						for (let key in additionalData) {
							if (additionalData.hasOwnProperty(key)) {
								// extend or override patternData with additional data
								patternData[key] = additionalData[key];
							}
						}
					}

					// Validate with JSON schema
					if (!config.get('server.production') && config.get('code.validation.jsonSchema.live')) {
						if (fs.existsSync(pattern.schemaFilePath)) {
							const schema = JSON.parse(fs.readFileSync(pattern.schemaFilePath, 'utf8'));
							const valid = ajv.validate(schema, patternData);
							if (!valid) {
								return {
									chain: chain,
									output: twigUtils.logAndRenderError(
										new Error(`JSON Schema: ${ajv.errorsText()}`)
									)
								};
							}
						}
					}

					// TODO CHECK WHAT THIS IF SHOULD DO
					if (name instanceof Twig.Template) {
						template = name;
					} else {
						// otherwise try to load it
						try {
							// Import file
							template = Twig.Templates.loadRemote(pattern.templateFilePath, {
								method: 'fs',
								base: '',
								async: false,
								options: this.options,
								id: pattern.templateFilePath,
							});
						} catch (e) {
							return {
								chain: chain,
								output: twigUtils.logAndRenderError(
									new Error(`Parse Error in Pattern ${name}: ${e.message}`)
								)
							};
						}
					}

					const html = template.render(patternData);

					// lint html snippet
					if (!config.get('server.production') && config.get('code.validation.htmllint.live')) {
						lint.lintSnippet(pattern.templateFilePath, html, htmllintOptions);
					}

					// return the rendered template
					return {
						chain: chain,
						output: html
					};

				} else {
					return {
						chain: chain,
						output: twigUtils.logAndRenderError(
							new Error(`Pattern \`${name}\` with template file \`${templateFile}.${config.get('nitro.viewFileExtension')}\` not found in folder \`${folder}\`.`)
						)
					};
				}

			} catch (e) {
				return {
					chain: chain,
					output: twigUtils.logAndRenderError(e)
				};
			}
		}
	};
};
