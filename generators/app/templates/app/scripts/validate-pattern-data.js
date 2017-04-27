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
 *	"linter": {
 *		"patternData": {
 *			 "logMissingSchemaAsError": false,
 *			 "logMissingSchemaAsWarning": true
 *		}
 *	 }
 *
 */
const chalk = require('chalk');
const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const extend = require('extend');
const globby = require('globby');
const Ajv = require('ajv');
const config = require('../core/config');
const ajv = new Ajv({allErrors: true});
const patternBasePaths = Object.keys(config.nitro.patterns).map((key) => {
	return config.nitro.patterns[key].path;
});
const wildcard = '*';

const elementGlobs = patternBasePaths.map((patternBasePath) => {
	return `${patternBasePath}/${wildcard}`;
});

let logMissingSchemaAsError;
let logMissingSchemaAsWarning;
let errorCouter = 0;

if (config.linter && config.linter.patternData) {
	logMissingSchemaAsError = config.linter.patternData.logMissingSchemaAsError === undefined
		? false : config.linter.patternData.logMissingSchemaAsError;
	logMissingSchemaAsWarning = config.linter.patternData.logMissingSchemaAsWarning === undefined
		? true : config.linter.patternData.logMissingSchemaAsWarning;
}

globby.sync(elementGlobs).forEach((patternPath, index) => {
	const schemaFilePath = `${patternPath}/schema.json`;

	if (!fs.existsSync(schemaFilePath)) {
		if (logMissingSchemaAsError) {
			console.log(chalk.red(`Error (${patternPath}): no schema file found ⛔️`));
			errorCouter += 1;
			return true;
		}
		if (logMissingSchemaAsWarning) {
			console.log(chalk.yellow(`Warn (${patternPath}): no schema file found ⚠️`));
		}
		return true;
	}

	globby.sync([`${patternPath}/_data/${wildcard}.json`]).forEach((patternDataFilePath) => {
		const patternData = JSON.parse(fs.readFileSync(patternDataFilePath, 'utf8'));
		const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));

		const valid = ajv.validate(schema, patternData);
		if (!valid) {
			errorCouter += 1;
			console.log(chalk.red(`Error (${patternDataFilePath}): ${ajv.errorsText()} ⛔️`));
		}
	});
});

if (errorCouter <= 0) {
	console.log(chalk.green(`Success: all pattern data are valid! 👍`));
} else {
	process.abort();
}
