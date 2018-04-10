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

function findTemplate(name) {
	try {
		return path.join(
			_findDirectoryByComponentName(name),
			'/',
			name.toLowerCase() + '.' + config.get('nitro.viewFileExtension')
		);
	} catch (e) {
		throw new Error('No Valid Template Found');
	}
}

function getDataJSON(name, variant) {
	const DATA_DIR = '_data';

	const fileName = (!!variant)
		? name + '-' + variant + '.json'
		: name.toLowerCase().concat('.json');

	try {
		const componentDir = _findDirectoryByComponentName(name);
		const dataFilePath = path.join(
			componentDir,
			'/',
			DATA_DIR,
			fileName
		);

		if (!fs.existsSync(dataFilePath)) {
			throw new Error('Not Data File ' + fileName + ' Found');
		}

		return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

	} catch (e) {
		throw e;
	}
}

module.exports = {
	logAndRenderError: logAndRenderError,
	findTemplate: findTemplate,
	getDataJSON: getDataJSON
};
