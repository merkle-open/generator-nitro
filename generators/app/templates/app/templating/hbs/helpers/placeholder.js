'use strict';

const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const extend = require('extend');
const config = require('../../../core/config');
const utils = require('../../../core/utils');
const hbsUtils = require('../utils');

module.exports = function placeholder () {

	try {
		const context = arguments[arguments.length - 1];
		const contextDataRoot = context.data && context.data.root ? context.data.root : {};
		const name = 'string' === typeof arguments[0] ? arguments[0] : context.hash.name;
		let templateFile = 'string' === typeof arguments[1] ? arguments[1] : context.hash.template;
		let placeholderData = {};

		// validate
		if(!name) {
			throw new Error('Placeholder name parameter not set');
		}

		if(!templateFile) {
			throw new Error('Placeholder template parameter not set');
		}

		// data
		if (contextDataRoot._locals) {
			extend(true, placeholderData, contextDataRoot._locals);
		}

		if (contextDataRoot._query) {
			extend(true, placeholderData, contextDataRoot._query);
		}

		templateFile += `.${config.nitro.view_file_extension}`;

		const templatePath = path.join(
			config.nitro.base_path,
			config.nitro.placeholders_directory,
			name,
			templateFile);

		if (utils.fileExistsSync(templatePath)) {
			return new hbs.handlebars.SafeString(
				hbs.handlebars.compile(
					fs.readFileSync(templatePath, 'utf8')
				)(placeholderData, context)
			);
		}

		throw new Error(`Placeholder ${templatePath} not found.`);

	}
	catch (e) {
		return hbsUtils.logAndRenderError(e);
	}
};
