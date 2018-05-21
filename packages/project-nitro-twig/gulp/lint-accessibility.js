'use strict';

const del = require('del');
const fs = require('fs');
const config = require('config');
const lintOptions = fs.existsSync('.accessibilityrc') ? JSON.parse(fs.readFileSync('.accessibilityrc', 'utf8')) : { force: true, accessibilityLevel: 'WCAG2A' };
const reportOptions = {
	reportType: 'json',
	reportLevels: {
		notice: true,
		warning: true,
		error: true,
	},
};
const tmpDirectory = `${config.get('nitro.tmpDirectory')}/views`;
const destDirectory = `${config.get('nitro.tmpDirectory')}/reports/${lintOptions.accessibilityLevel}`;

module.exports = (gulp, plugins) => {
	return () => {
		return del(destDirectory)
			.then(() => {
				return gulp.src(`${tmpDirectory}/*.html`)
					.pipe(plugins.plumber())
					.pipe(plugins.accessibility(lintOptions))
					.on('error', console.log)
					.pipe(plugins.accessibility.report(reportOptions))
					.pipe(plugins.rename({ extname: '.json' }))
					.pipe(gulp.dest(destDirectory))
					.on('end', () => console.log(`Accessibility report generated at ${destDirectory}`));
			});
	};
};
