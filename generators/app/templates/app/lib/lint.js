'use strict';

const fs = require('fs');
const config = require('../core/config');
const htmllint = require('htmllint');

function getHtmllintOptions (isSnippet) {
	const configPath = '.htmllintrc';
	let htmllintOptions = {};
	if (fs.existsSync(configPath)) {
		htmllintOptions = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}
	if (isSnippet) {
		htmllintOptions['doctype-first'] = false;
	}

	return htmllintOptions;
}

function lintSnippet(templatePath, markup, options) {

	const htmllintOptions = options || getHtmllintOptions(true);

	htmllint(markup, htmllintOptions)
		.then(function (issues) {
			if (issues.length) {
				console.log(`[htmllint] ${templatePath.toString().replace(config.nitro.base_path,'')}`);
				issues.forEach(function (issue, idx) {
					let dataString = Object.keys(issue.data).map((key) => {
						return issue.data[key];
					}).join(', ');
					let msg = `[${issue.line}:${issue.column}] (${issue.rule}) ${dataString}`;

					console.error(msg.toString());
				});
			}
		});
}

module.exports = {
	getHtmllintOptions,
	lintSnippet
};
