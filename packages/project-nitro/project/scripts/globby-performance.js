'use strict';

/**
 *
 * Usage
 *
 * node project/scripts/globby-performance.js
 *
 */
const config = require('config');
const clc = require('cli-color');

(async function globTest() {
	const { globbySync } = await import('globby');

	const folder = 'Ex-link';
	const templateFile = 'ex-link';

	const patternBasePaths = Object.keys(config.get('nitro.patterns')).map((key) => {
		const configKey = `nitro.patterns.${key}.path`;
		return config.has(configKey) ? config.get(configKey) : false;
	});

	const elementGlobs = patternBasePaths.map((basePath) => {
		return `${basePath}/*/elements/${folder}/${templateFile}.${config.get('nitro.viewFileExtension')}`;
	});

	const timer1 = Date.now();

	globbySync(elementGlobs).forEach((templatePath) => {
		console.log(`${clc.green('Success:')} Element ${folder} found in ${templatePath}`);
	});

	const diff = Date.now() - timer1;

	console.log(`${clc.yellow('Time for globby:')} ${diff} ms`);
})();
