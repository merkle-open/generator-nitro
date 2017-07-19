'use strict';

const fs = require('fs');
const config = require('config');
const htmllint = require('htmllint');
const textTable = require('text-table');

function getHtmllintOptions(isSnippet) {
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

	return htmllint(markup, htmllintOptions)
		.then((issues) => {
			htmllintReporter(templatePath, issues);
		});
}

function htmllintReporter(filepath, issues) {
	if (issues.length > 0) {

		const filePath = filepath.toString().replace(config.get('nitro.basePath'), '');
		const tableData = [];

		issues.forEach((issue) => {
			issue.msg = issue.msg || htmllint.messages.renderIssue(issue);
			issue.cell = `${('    ' + issue.line).slice(-4)}:${issue.column}`;
			tableData.push([
				issue.cell,
				issue.msg,
				issue.rule,
			]);
		});

		const table = textTable(tableData);

		// output
		console.log(`\n[htmllint] ${filePath}`);
		console.log(table);
		console.log('\n');

		process.exitCode = 1;
	}
}

module.exports = {
	getHtmllintOptions,
	lintSnippet,
	htmllintReporter,
};
