'use strict';

const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const config = require('config');

// collect helpers
const files = {};
const coreHelpersDir = path.normalize(path.join(__dirname, 'helpers'));
const projectHelpersDir = `${config.get('nitro.basePath')}project/helpers`;
const coreFiles = fs.readdirSync(coreHelpersDir);
const projectFiles = fs.readdirSync(projectHelpersDir);

coreFiles.map((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = `${coreHelpersDir}/${file}`;
	}
});

projectFiles.map((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = `${projectHelpersDir}/${file}`;
	}
});

Object.keys(files).forEach((key) => {
	hbs.registerHelper(key, require(files[key]));
});

module.exports = hbs;
