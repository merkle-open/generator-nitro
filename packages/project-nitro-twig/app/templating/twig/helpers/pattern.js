'use strict';

/**
 * twig helper: {% pattern PatternName Data Variation %}
 *
 * Usage
 * {% pattern name='button' data='button-fancy' %}
 *
 * Usage (passing arguments)
 * {% pattern name='button' disabled=true %}
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

	return pattern;
}


module.exports = function (Twig) {
	return {
		type: 'pattern',
		regex: /^pattern\s+(\w+='\S*')\s*(\w+='\S*')?\s*(\w+='\S*')?$/,
		next: [],
		open: true,
		compile: function(token) {

			// get value for name parameter
			const nameKeyValue = token.match[1];
			const nameValue = nameKeyValue.split('=')[1];

			// get value for data parameter
			const dataKeyValue = token.match[2];
			let dataValue = '';

			if (dataKeyValue !== undefined) {
				dataValue = dataKeyValue.split('=')[1];
			}

			// get value for template parameter
			const templateKeyValue = token.match[3];
			let templateValue = '';

			if (templateKeyValue !== undefined) {
				templateValue = templateKeyValue.split('=')[1];
			}

			// compile and store values in token
			token.name = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: nameValue.trim()
			}]).stack;

			token.data = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: dataValue.trim()
			}]).stack;

			token.templateFile = Twig.expression.compile.apply(this, [{
				type: Twig.expression.type.expression,
				value: templateValue.trim()
			}]).stack;

			delete token.match;
			return token;
		},
		parse: function(token, context, chain) {
			try {
				const name = Twig.expression.parse.apply(this, [token.name, context]);
				const folder = name.replace(/[^A-Za-z0-9-]/g, '');
				const dataFromPatternHelper = Twig.expression.parse.apply(this, [token.data, context]);
				let templateFile = Twig.expression.parse.apply(this, [token.templateFile, context]);

				if (templateFile === undefined) {
					templateFile = folder.toLowerCase();
				}

				const patternData = {};                                                // collected pattern data
				let dataFile = folder.toLowerCase();                                   // default data file
				let passedData = null;                                                 // passed data to pattern helper
				let template;

				// check if the twig template already exists
				if (name instanceof Twig.Template) {
					template = pattern;
				} else {
					switch (typeof dataFromPatternHelper) {
						case 'string':
							dataFile = dataFromPatternHelper.replace(/\.json$/i, '').toLowerCase();
							break;
						case 'object':
							passedData = extend(true, passedData, dataFromPatternHelper);
							break;
						case 'number':
						case 'boolean':
							passedData = dataFromPatternHelper;
							break;
						default:
							break;
					}

					// TODO Add additional argument for partial extending / overriding of data params

					const pattern = getPattern(folder, templateFile, dataFile);

					if (pattern) {
						try {
							// TODO contextDataRoot._locals

							if (passedData) {
								extend(true, patternData, passedData);
							} else if (fs.existsSync(pattern.jsonFilePath)) {
								extend(true, patternData, JSON.parse(fs.readFileSync(pattern.jsonFilePath, 'utf8')));
							}

							// TODO contextDataRoot._query

							// TODO context.hash

							// TODO check pattern children

							// TODO Validate with JSON schema

							// Import file
							template = Twig.Templates.loadRemote(pattern.templateFilePath, {
								method: 'fs',
								base: '',
								async: false,
								options: this.options,
								id: pattern.templateFilePath
							});
						} catch (e) {
							throw new Error(`Parse Error in Pattern ${name}: ${e.message}`);
						}
					}
				}

				return {
					chain: chain,
					output: template.render(patternData)
				};
			} catch (e) {
				return twigUtils.logAndRenderError(e);
			}
		}
	};
};
