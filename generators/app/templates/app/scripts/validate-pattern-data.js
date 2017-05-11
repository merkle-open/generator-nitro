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
 * example config in ./config.json
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
const path = require('path');
const globby = require('globby');
const Ajv = require('ajv');
const config = require('../core/config');
const ajv = new Ajv({allErrors: true});
const wildcard = '*';
const patternBasePaths = Object.keys(config.nitro.patterns).map((key) => {
	return config.nitro.patterns[key].path;
});
const patternGlobs = patternBasePaths.map((patternBasePath) => {
	return `${patternBasePath}/${wildcard}`;
}).concat(
	patternBasePaths.map((patternBasePath) => {
		return `${patternBasePath}/${wildcard}/elements/${wildcard}`;
	})
);

let logMissingSchemaAsError;
let logMissingSchemaAsWarning;
let errorCouter = 0;
let patternCouter = 0;

if (config.code && config.code.validation && config.code.validation.jsonSchema) {
	logMissingSchemaAsError = config.code.validation.jsonSchema.logMissingSchemaAsError === undefined
		? false : config.code.validation.jsonSchema.logMissingSchemaAsError;
	logMissingSchemaAsWarning = config.code.validation.jsonSchema.logMissingSchemaAsWarning === undefined
		? true : config.code.validation.jsonSchema.logMissingSchemaAsWarning;
}

globby.sync(patternGlobs).forEach((patternPath, index) => {
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

		const valid = ajv.validate(schema, patternData);
		if (!valid) {
			errorCouter += 1;
			console.log(`${chalk.red('Error')} (${patternDataFilePath}): ${ajv.errorsText()}`);
		}
	});
});

if (errorCouter <= 0) {
	console.log(`${chalk.green('Success:')} all data from each of the ${patternCouter} patterns are valid!`);
} else {
	process.abort();
}
