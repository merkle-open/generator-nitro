const fs = require('fs');
const path = require('path');
const config = require('config');
const twig = require('twig');
const utils = require('../../core/utils');

function logAndRenderError(e) {
	console.info(e.message);
	return twig({
		data: '<p class="nitro-msg nitro-msg--error">' + e.message + '</p>',
	}).render();
}

function _findDirectoryByComponentName(name) {
	const patterns = config.get('nitro.patterns');
	for (let key in patterns) {
		if (patterns.hasOwnProperty(key)) {
			const component = patterns[key];
			if (component.hasOwnProperty('path')) {
				const templateDirectory = path.join(
					component.path,
					'/',
					name
				);

				const templatePath = path.join(
					templateDirectory,
					'/',
					name.toLowerCase() + '.' + config.get('nitro.viewFileExtension')
				);

				if (fs.existsSync(templatePath)) {
					return templateDirectory;
				}
			}
		}
	}

	throw new Error('Pattern Directory Not Found');
}

function findPartial(name) {
	try {
		return path.join(
			config.get('nitro.viewPartialsDirectory').toString(),
			'/',
			name.toLowerCase() + '.' + config.get('nitro.viewFileExtension')
		);
	} catch (e) {
		throw new Error('No Valid Partial Found');
	}
}

function findTemplate(name, variation) {
	try {

		let assembledName = name.toLowerCase();

		if (variation !== undefined) {
			assembledName += `-${variation.toLowerCase()}`;
		}

		const templateFilePath = path.join(
			_findDirectoryByComponentName(name),
			'/',
			assembledName + '.' + config.get('nitro.viewFileExtension')
		);

		if (!fs.existsSync(templateFilePath)) {
			throw new Error('Template File ' + assembledName + '.' + config.get('nitro.viewFileExtension') + ' for pattern ' + name  + ' not found');
		}

		return templateFilePath;

	} catch (e) {
		console.warn(e.message);
	}
}

function getDataJSON(pattern, data) {
	const DATA_DIR = '_data';

	const fileName = data.toLowerCase().concat('.json');

	try {
		const componentDir = _findDirectoryByComponentName(pattern);
		const dataFilePath = path.join(
			componentDir,
			'/',
			DATA_DIR,
			fileName
		);

		if (!fs.existsSync(dataFilePath)) {
			throw new Error('Data File ' + fileName + ' for pattern ' + pattern + ' not found');
		}

		return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

	} catch (e) {
		console.warn(e.message);
	}
}

module.exports = {
	logAndRenderError: logAndRenderError,
	findTemplate: findTemplate,
	findPartial: findPartial,
	getDataJSON: getDataJSON
};
