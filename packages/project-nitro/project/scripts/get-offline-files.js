'use strict';

/**
 *
 * Usage
 *
 * node project/scripts/get-offline-files.js
 *  or
 * yarn get-offline-files
 *
 */
const chalk = require('chalk');
const del = require('del');
const path = require('path');
const scrape = require('website-scraper');

const target = 'public/static/';
const options = {
	urls: ['https://khan.github.io/tota11y/tota11y/build/tota11y.min.js'],
	filenameGenerator: 'bySiteStructure',
	// recursive: true,
	ignoreErrors: false,
	directory: path.resolve(target),
};

del(target).then(() => {
	scrape(options)
		.then(() => {
			console.log(`${chalk.green('Success:')} All data was downloaded successfully!`);
		})
		.catch((err) => {
			console.log(`${chalk.red('Error:')} There was an error downloading files!`);
			console.log(err.message);
		});
});
