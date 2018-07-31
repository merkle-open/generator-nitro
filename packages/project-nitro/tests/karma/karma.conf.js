'use strict';

/**
 * Karma configuration
 * Requires that asset `ui.min.js` and `vendor.min.js` is compiled
 */

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '../../',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			// 'node_modules/terrific/dist/terrific.min.js',
			// 'node_modules/@babel/polyfill/dist/polyfill.js',
			'public/assets/js/vendor.min.js',
			'public/assets/js/ui.min.js',
			'src/patterns/**/test/*.test.js',
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/patterns/**/test/*.test.js': ['babel'],
		},
		babelPreprocessor: {
			options: {
				presets: ['@babel/env'],
				sourceMap: 'inline',
			},
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		// port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		// 'PhantomJS', 'Chrome', 'Firefox', 'Safari', 'IE', 'Opera'
		browsers: ['PhantomJS'],

		phantomjsLauncher: {
			// Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
			exitOnResourceError: true,
		},

		// transport methods between the browser and testing server
		// not using 'websocket' prevents PhantomJS crashes on some systems
		// transports: ['polling'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
	});
};
