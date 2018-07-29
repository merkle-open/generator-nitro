'use strict';

/**
 *
 * Usage
 *
 * node project/scripts/globby-performance.js
 *
 */
const globby = require('globby');
const config = require('config');
const chalk = require('chalk');

(function globTest() {
	const folder = 'Ex-link';
	const templateFile = 'ex-link';
	const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) => {
		const configKey = `nitro.patterns.${key}.path`;
		const patternPath = config.has(configKey) ? config.get(configKey) : false;
		return patternPath;
	});
	const elementGlobs = patternBasePaths.map((patternBasePath) => {
		return `${patternBasePath}/*/elements/${folder}/${templateFile}.${config.get('nitro.viewFileExtension')}`;
	});

	const timer1 = new Date();

	globby.sync(elementGlobs).forEach((templatePath) => {
		console.log(`${chalk.green('Success:')} Element ${folder} found in ${templatePath}`);
	});

	const timer2 = new Date();
	const diff = timer2 - timer1;
	console.log(`${chalk.yellow('Time for globby:')} ${diff} ms`);
}());

