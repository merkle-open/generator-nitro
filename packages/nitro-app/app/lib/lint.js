'use strict';

const config = require('config');
const { HtmlValidate, formatterFactory } = require('html-validate');

const htmlvalidate = new HtmlValidate();
const format = formatterFactory('stylish');

function _getHtmlvalidateConfig() {
	try {
		return require(`${config.get('nitro.basePath')}.htmlvalidate.js`);
	} catch (e) {
		return {};
	}
}

function lintSnippet(templatePath, markup) {
	const report = htmlvalidate.validateString(markup, _getHtmlvalidateConfig());
	const filePath = templatePath.replace(config.get('nitro.basePath'), '');
	if (!report.valid) {
		console.log(`\nMarkup error in: ${filePath}`);
		console.log(format(report.results));
	} else if (report.warningCount) {
		console.log(`\nMarkup warning in: ${filePath}`);
		console.log(format(report.results));
	}
}

module.exports = {
	lintSnippet,
};
