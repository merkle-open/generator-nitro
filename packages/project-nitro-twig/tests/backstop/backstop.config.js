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
	},
];

module.exports = (options) => {
	const scenarios = [
		{
			label: 'Homepage',
			// cookiePath: 'tests/backstop/engine_scripts/cookies.json',
			url: `http://localhost:${options.port}/index`,
			referenceUrl: '',
			readyEvent: '',
			readySelector: '',
			delay: 0,
			hideSelectors: [],
			removeSelectors: ['.m-example--blue'],
			hoverSelector: '',
			clickSelector: '',
			postInteractionWait: 0,
			selectors: ['.m-example'],
			selectorExpansion: true,
			expect: 2,
			misMatchThreshold: 0.1,
			requireSameDimensions: true,
		},
	];

	return {
		id: 'nitro_test',
		viewports,
		onBeforeScript: 'puppet/onBefore.js',
		onReadyScript: 'puppet/onReady.js',
		scenarios,
		paths: {
			bitmaps_reference: `tests/backstop/bitmaps_reference/${platform}`,
			bitmaps_test: 'project/tmp/reports/backstop/bitmaps_test',
			engine_scripts: 'tests/backstop/engine_scripts',
			html_report: 'public/reports/backstop/html',
			ci_report: 'project/tmp/reports/backstop/ci',
		},
		report: ['browser'],
		engineFlags: [],
		engine: 'puppeteer',
		engineOptions: {
			args: ['--no-sandbox'],
		},
		resembleOutputOptions: {
			ignoreAntialiasing: true,
		},
		asyncCaptureLimit: 5,
		asyncCompareLimit: 50,
		debug: false,
		debugWindow: false,
	};
};
