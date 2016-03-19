var fs = require('fs');
var path = require('path');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var cfg = require('./config');
var coreHelpersDir = cfg.nitro.base_path + 'app/helpers/';
var projectHelpersDir = cfg.nitro.base_path + 'project/helpers/';

hbsutils.registerWatchedPartials(cfg.nitro.base_path + cfg.nitro.view_partials_directory);

var files = {};
var coreFiles = fs.readdirSync(coreHelpersDir);
var projectFiles = fs.readdirSync(projectHelpersDir);

coreFiles.map(function (file) {
	if ('.js' === path.extname(file)) {
		files[path.basename(file, '.js')] = coreHelpersDir + file;
	}
});

projectFiles.map(function (file) {
	if ('.js' === path.extname(file)) {
		files[path.basename(file, '.js')] = projectHelpersDir + file;
	}
});

for (var key in files) {
	if (files.hasOwnProperty(key)) {
		hbs.registerHelper(key, require(files[key]));
	}
}

module.exports = hbs;
