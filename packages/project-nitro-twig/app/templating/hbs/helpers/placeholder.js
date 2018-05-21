'use strict';

const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const extend = require('extend');
const config = require('config');
const hbsUtils = require('../utils');
const lint = require('../../../lib/lint');
const htmllintOptions = lint.getHtmllintOptions(true);

module.exports = function placeholder() {

	try {
		const context = arguments[arguments.length - 1];
		const contextDataRoot = context.data && context.data.root ? context.data.root : {};
		const name = typeof arguments[0] === 'string' ? arguments[0] : context.hash.name;
		let templateFile = typeof arguments[1] === 'string' ? arguments[1] : context.hash.template;
		const placeholderData = {};

		// validate
		if (!name) {
			throw new Error('Placeholder name parameter not set');
		}

		if (!templateFile) {
			throw new Error('Placeholder template parameter not set');
		}

		// data
		if (contextDataRoot._locals) {
			extend(true, placeholderData, contextDataRoot._locals);
		}

		if (contextDataRoot._query) {
			extend(true, placeholderData, contextDataRoot._query);
		}

		if (context.hash) {
			extend(true, placeholderData, context.hash);
		}

		templateFile += `.${config.get('nitro.viewFileExtension')}`;

		const templatePath = path.join(
			config.get('nitro.basePath'),
			config.get('nitro.placeholdersDirectory'),
			name,
			templateFile);

		if (fs.existsSync(templatePath)) {
			const html = hbs.handlebars.compile(
				fs.readFileSync(templatePath, 'utf8')
			)(placeholderData, context);

			// lint html snippet
			if (!config.get('server.production') && config.get('code.validation.htmllint.live')) {
				lint.lintSnippet(templatePath, html, htmllintOptions);
			}
			return new hbs.handlebars.SafeString(html);
		}

		throw new Error(`Placeholder ${templatePath} not found.`);

	} catch (e) {
		return hbsUtils.logAndRenderError(e);
	}
};
