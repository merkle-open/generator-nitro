'use strict';

const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const config = require('config');
const utils = require('./utils');

// collect helpers
const files = {};
const coreHelpersDir = path.normalize(path.join(__dirname, 'helpers'));
const projectHelpersDir = path.normalize(`${config.get('nitro.basePath')}project/helpers`);
const coreFiles = fs.readdirSync(coreHelpersDir);
const projectFiles = utils.readdirSyncRecursive(projectHelpersDir);

coreFiles.forEach((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = path.normalize(`${coreHelpersDir}/${file}`);
	}
});

projectFiles.forEach((file) => {
	if (path.extname(file) === '.js') {
		files[path.basename(file, '.js')] = path.normalize(`${projectHelpersDir}/${file}`);
	}
});

Object.keys(files).forEach((key) => {
	hbs.registerHelper(key, require(files[key]));
});

module.exports = hbs;
