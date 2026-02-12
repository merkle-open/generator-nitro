'use strict';

/**
 *
 * Usage
 *
 * node app/scripts/validate-pattern-data.js
 *  or
 * npm run lint:data
 *  or
 * yarn lint:data
 *
 * example config in config/default.js
 *
 * "code": {
 *    "validation": {
 *        "jsonSchema": {
 *            "logMissingSchemaAsError": false,
 *            "logMissingSchemaAsWarning": true
 *         }
 *    }
 * }
 *
 */
const clc = require('cli-color');
const fs = require('fs');
const Ajv = require('ajv');
const config = require('config');

(async () => {

	const { globbySync } = await import('globby');

	const ajv = new Ajv({ allErrors: true });
	const wildcard = '*';

	const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) =>
		config.get(`nitro.patterns.${key}.path`)
	);

	const patternGlobs = patternBasePaths
		.map((p) => `${p}/${wildcard}`)
		.concat(patternBasePaths.map((p) => `${p}/${wildcard}/elements/${wildcard}`));

	const logMissingSchemaAsError = config.has('code.validation.jsonSchema.logMissingSchemaAsError')
		? config.get('code.validation.jsonSchema.logMissingSchemaAsError')
		: false;

	const logMissingSchemaAsWarning = config.has('code.validation.jsonSchema.logMissingSchemaAsWarning')
		? config.get('code.validation.jsonSchema.logMissingSchemaAsWarning')
		: true;

	let errorCounter = 0;
	let patternCounter = 0;

	// collect all schemas
	globbySync(patternGlobs, { onlyFiles: false }).forEach((patternPath) => {
		const schemaFilePath = `${patternPath}/schema.json`;

		if (fs.existsSync(schemaFilePath)) {
			// console.log(`Add ${schemaFilePath}`);
			const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
			if (schema.$id) {
				// ajv.addSchema(schema);
				ajv.addMetaSchema(schema);
			}
		}
	});

	// validate pattern data
	globbySync(patternGlobs, { onlyFiles: false }).forEach((patternPath) => {
		const schemaFilePath = `${patternPath}/schema.json`;
		patternCounter++;

		if (!fs.existsSync(schemaFilePath)) {
			if (logMissingSchemaAsError) {
				console.log(`${clc.red('Error')} (${patternPath}): no schema file found`);
				errorCounter++;
				return;
			}
			if (logMissingSchemaAsWarning) {
				console.log(`${clc.yellow('Warn')} (${patternPath}): no schema file found`);
			}
			return;
		}

		globbySync([`${patternPath}/_data/${wildcard}.json`]).forEach((dataPath) => {
			const patternData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
			const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
			const schemaToApply = schema.$id || schema;

			// console.log(`validate ${schemaFilePath} with ${dataPath}`);
			const valid = ajv.validate(schemaToApply, patternData);
			if (!valid) {
				errorCounter++;
				console.log(`${clc.red('Error')} (${dataPath}): ${ajv.errorsText()}`);
			}
		});
	});

	// summary
	if (errorCounter === 0) {
		console.log(`${clc.green('Success:')} all data from each of the ${patternCounter} patterns are valid!\n`);
	} else {
		console.log(`${clc.red('Error:')} we detected ${errorCounter} errors in your data.\n`);
		process.exitCode = 1;
	}

})();
