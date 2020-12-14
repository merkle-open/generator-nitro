'use strict';

const exportClean = require('./tasks/export-clean.js');
const exportViews = require('./tasks/export-views.js');
const exportProcessing = require('./tasks/export-processing.js');

function getAdditionalRoutes(additionalRoutesConfig) {
	return additionalRoutesConfig && Array.isArray(additionalRoutesConfig) ? additionalRoutesConfig : [];
}

function getMergedConfigProps(config) {
	const collectedConfig = {};

	collectedConfig.shouldExportViews = !config.exporter.length
		? config.exporter.views
		: config.exporter.some((exporterConfig) => exporterConfig.views !== false);

	collectedConfig.languages = !config.exporter.length
		? config.exporter.i18n
		: config.exporter
				.reduce((acc, exporterConfig) => [...acc, ...exporterConfig.i18n], ['default'])
				.filter((v, i, a) => a.indexOf(v) === i);

	collectedConfig.additionalRoutes = !config.exporter.length
		? getAdditionalRoutes(config.exporter.additionalRoutes)
		: config.exporter
				.reduce((acc, exporterConfig) => [...acc, ...getAdditionalRoutes(exporterConfig.additionalRoutes)], [])
				.filter((v, i, a) => a.indexOf(v) === i);

	return collectedConfig;
}

module.exports = function (gulp, config) {
	const mergedConfig = getMergedConfigProps(config);

	gulp.task('export-clean', exportClean(config));
	gulp.task('export-views', () => exportViews(gulp, config));
	gulp.task('export-processing', () => exportProcessing(gulp, config));

	if (mergedConfig.shouldExportViews) {
		// set global env to use in other gulp tasks
		if (mergedConfig.languages.length) {
			process.env.NITRO_VIEW_LOCALES = mergedConfig.languages.join(',');
		}
		if (mergedConfig.additionalRoutes.length) {
			process.env.NITRO_ADDITIONAL_ROUTES = mergedConfig.additionalRoutes.join(',');
		}

		gulp.task('export', gulp.series('export-clean', 'dump-views', 'export-views', 'export-processing'));
	} else {
		gulp.task('export', gulp.series('export-clean', 'export-processing'));
	}
};
