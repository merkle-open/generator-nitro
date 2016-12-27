'use strict';

const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const config = require('../../core/config');

// collect helpers
let files = {};
const coreHelpersDir = config.nitro.base_path + 'app/templating/hbs/helpers/';
const projectHelpersDir = config.nitro.base_path + 'project/helpers/';
const coreFiles = fs.readdirSync(coreHelpersDir);
const projectFiles = fs.readdirSync(projectHelpersDir);

coreFiles.map((file) => {
	if ('.js' === path.extname(file)) {
		files[path.basename(file, '.js')] = coreHelpersDir + file;
	}
});

projectFiles.map((file) => {
	if ('.js' === path.extname(file)) {
		files[path.basename(file, '.js')] = projectHelpersDir + file;
	}
});

for (let key in files) {
	if (files.hasOwnProperty(key)) {
		hbs.registerHelper(key, require(files[key]));
	}
}

module.exports = hbs;
