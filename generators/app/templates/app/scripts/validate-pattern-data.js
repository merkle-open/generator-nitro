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
const config = require('config');
const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
const wildcard = '*';
const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) => {
	return config.get(`nitro.patterns.${key}.path`);
});
const patternGlobs = patternBasePaths.map((patternBasePath) => {
	return `${patternBasePath}/${wildcard}`;
}).concat(
	patternBasePaths.map((patternBasePath) => {
		return `${patternBasePath}/${wildcard}/elements/${wildcard}`;
	})
);
const logMissingSchemaAsError = config.has('code.validation.jsonSchema.logMissingSchemaAsError')
	? config.get('code.validation.jsonSchema.logMissingSchemaAsError') : false;
const logMissingSchemaAsWarning = config.has('code.validation.jsonSchema.logMissingSchemaAsWarning')
	? config.get('code.validation.jsonSchema.logMissingSchemaAsWarning') : true;

let errorCouter = 0;
let patternCouter = 0;

globby.sync(patternGlobs, {onlyFiles: false}).forEach((patternPath) => {
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
