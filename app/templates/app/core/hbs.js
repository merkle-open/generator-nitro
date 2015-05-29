var fs = require('fs'),
	path = require('path'),
	hbs = require('hbs'),
	hbsutils = require('hbs-utils')(hbs),
	cfg = require('./config'),
	coreHelpersDir = cfg.nitro.base_path + 'app/helpers/',
	projectHelpersDir = cfg.nitro.base_path + 'project/helpers/';

hbsutils.registerWatchedPartials(cfg.nitro.base_path + cfg.nitro.view_partials_directory);

var files = {},
	coreFiles = fs.readdirSync(coreHelpersDir),
	projectFiles = fs.readdirSync(projectHelpersDir);

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
