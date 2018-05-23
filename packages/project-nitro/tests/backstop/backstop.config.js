'use strict';

/**
 * backstop configuration
 * requires compiled assets
 * currently doesn't work with phantomjs
 */

const os = require('os');
const platform = os.platform();
const viewports = [
	{
		label: 'phone',
		width: 320,
		height: 568,
	},
	{
		label: 'tablet',
		width: 768,
		height: 1024,
	},
	{
		label: 'desktop',
		width: 1280,
		height: 1024,
	}
];

module.exports = (options) => {
	const scenarios = [
		{
			label: 'Homepage',
			url: `http://localhost:${options.port}/index`,
			onBeforeScript: 'onBefore.js',
			readyEvent: null,
			delay: 1000,
			hideSelectors: [],
			removeSelectors: [
				'.m-example--blue',
			],
			onReadyScript: 'onReady.js',
			selectors: ['.m-example'],
			selectorExpansion: true,
			misMatchThreshold: 0.1,
			requireSameDimensions: true,
		},
	];

	return {
		id: 'nitro_test',
		viewports,
		scenarios,
		paths: {
			bitmaps_reference: `tests/backstop/bitmaps_reference/${platform}`,
			bitmaps_test: 'project/tmp/reports/backstop/bitmaps_test',
			engine_scripts: 'tests/backstop/engine_scripts',
			html_report: 'public/reports/backstop/html',
			ci_report: 'project/tmp/reports/backstop/ci',
		},
		engineFlags: [],
		engine: 'chrome',
		report: ['browser'],
		resembleOutputOptions: {
			ignoreAntialiasing: true,
		},
		asyncCaptureLimit: 5,
		debug: false,
		debugWindow: false,
	}
};
