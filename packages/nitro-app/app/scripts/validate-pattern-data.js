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
const chalk = require('chalk');
const fs = require('fs');
const globby = require('globby');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const config = require('config');
const wildcard = '*';
const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) => {
	return config.get(`nitro.patterns.${key}.path`);
});
const patternGlobs = patternBasePaths
	.map((patternBasePath) => {
		return `${patternBasePath}/${wildcard}`;
	})
	.concat(
		patternBasePaths.map((patternBasePath) => {
			return `${patternBasePath}/${wildcard}/elements/${wildcard}`;
		})
	);
const logMissingSchemaAsError = config.has('code.validation.jsonSchema.logMissingSchemaAsError')
	? config.get('code.validation.jsonSchema.logMissingSchemaAsError')
	: false;
const logMissingSchemaAsWarning = config.has('code.validation.jsonSchema.logMissingSchemaAsWarning')
	? config.get('code.validation.jsonSchema.logMissingSchemaAsWarning')
	: true;

let errorCouter = 0;
let patternCouter = 0;

// collect all schemas
globby.sync(patternGlobs, { onlyFiles: false }).forEach((patternPath) => {
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
globby.sync(patternGlobs, { onlyFiles: false }).forEach((patternPath) => {
	const schemaFilePath = `${patternPath}/schema.json`;
	patternCouter += 1;

	if (!fs.existsSync(schemaFilePath)) {
		if (logMissingSchemaAsError) {
			console.log(`${chalk.red('Error')} (${patternPath}): no schema file found`);
			errorCouter += 1;
			return true;
		}
		if (logMissingSchemaAsWarning) {
			console.log(`${chalk.yellow('Warn')} (${patternPath}): no schema file found`);
		}
		return true;
	}

	globby.sync([`${patternPath}/_data/${wildcard}.json`]).forEach((patternDataFilePath) => {
		const patternData = JSON.parse(fs.readFileSync(patternDataFilePath, 'utf8'));
		const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));

		// console.log(`validate ${schemaFilePath} with ${patternDataFilePath}`);
		const schemaToUse = schema.$id || schema;
		const valid = ajv.validate(schemaToUse, patternData);
		if (!valid) {
			errorCouter += 1;
			console.log(`${chalk.red('Error')} (${patternDataFilePath}): ${ajv.errorsText()}`);
		}
	});
});

if (errorCouter <= 0) {
	console.log(`${chalk.green('Success:')} all data from each of the ${patternCouter} patterns are valid!\n`);
} else {
	console.log(`${chalk.red('Error:')} we detected ${errorCouter} errors in your data.\n`);
	process.exitCode = 1;
}
