'use strict';

const port = process.env.PORT || '8889';
const hostName = process.env.HOST_NAME || 'http://host.docker.internal';
const host = `${hostName}:${port}`;
const viewports = [
	{
		label: 'phone',
		width: 360,
		height: 640,
	},
	{
		label: 'tablet',
		width: 768,
		height: 1024,
	},
	{
		label: 'desktop',
		width: 1920,
		height: 1080,
	},
];

module.exports = {
	host,
	baseConfig: {
		id: 'Screen',
		viewports,
		onBeforeScript: 'puppet/onBefore.js',
		onReadyScript: 'puppet/onReady.js',
		paths: {
			bitmaps_reference: 'tests/backstop/bitmaps_reference',
			bitmaps_test: 'project/tmp/reports/backstop/bitmaps_test',
			engine_scripts: 'tests/backstop/engine_scripts',
			html_report: 'public/reports/backstop/html',
			ci_report: 'project/tmp/reports/backstop/ci',
		},
		report: ['browser', 'CI'],
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
		dockerCommandTemplate: 'docker run --rm -it --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}',
	},
	baseScenario: {
		label: 'scenario x',
		// cookiePath: 'tests/backstop/engine_scripts/cookies.json',
		url: '',
		referenceUrl: '',
		readyEvent: '',
		readySelector: '',
		delay: 0,
		hideSelectors: [],
		removeSelectors: [],
		hoverSelector: '',
		clickSelector: '',
		postInteractionWait: 0,
		selectors: [],
		selectorExpansion: false,
		expect: 0,
		misMatchThreshold: 0.01,
		requireSameDimensions: true,
	},
};
