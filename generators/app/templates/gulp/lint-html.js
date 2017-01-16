'use strict';

const utils = require('./utils');
const config = require('../app/core/config');
const srcPattern = `${utils.getTmpDirectory('views')}/*.html`;

module.exports = function (gulp, plugins) {

	function htmllintReporter(filepath, issues) {
		if (issues.length > 0) {
			console.log(`\n[htmllint] ${filepath.toString().replace(config.nitro.base_path,'')}`);
			issues.forEach(function (issue) {
				let dataString = Object.keys(issue.data).map((key) => {
					return issue.data[key];
				}).join(', ');
				let msg = `[${issue.line}:${issue.column}] (${issue.rule}) ${dataString} - ${issue.msg}`;

				console.error(msg);
			});
			process.exitCode = 1;
		}
	}

	return () => {
		return gulp.src(srcPattern)
			.pipe(plugins.htmllint({}, htmllintReporter))
			.on('end', () => {});
	}
};
