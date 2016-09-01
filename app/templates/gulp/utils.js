var cfg = require('../app/core/config');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync;
var assets = {};

function getBrowserCompatibility() {
	return cfg.code.compatibility.browsers;
}

function getBrowserSyncInstance() {
	var name = 'Nitro' + cfg.server.port;
	if (!browserSync) {
		browserSync = require('browser-sync').create(name);
	}
	return browserSync;
}

function getSourcePatterns(ext) {
	var type = typeof ext === 'string' && ( ext === 'js' || ext === 'css' ) ? ext : null;

	if (!assets.hasOwnProperty('js') || !assets.hasOwnProperty('css')) {
		updateSourcePatterns();
	}

	return type ?  assets[type] : assets;
}

function updateSourcePatterns() {
	var key, ext, type, asset, result, patternKey, patternPath;

	assets = {
		css: [],
		js: []
	};

	for (key in cfg.assets) {
		if (cfg.assets.hasOwnProperty(key)) {
			ext = path.extname(key);
			if (ext) {
				type = ext.replace(/[^a-z]/g, '');
				asset = cfg.assets[key];
				result = {
					name: key,
					deps: [],
					src:  []
				};

				for (patternKey in asset) {
					if (asset.hasOwnProperty(patternKey)) {
						patternPath = asset[patternKey];
						if (patternPath.indexOf('+') === 0) {
							result.deps.push(patternPath.substr(1));
						}
						else {
							result.src.push(patternPath);
						}
					}
				}
				assets[type].push(result);
			}
		}
	}
}

function getTask(task) {
	return require('./' + task)(gulp, plugins);
}

function reloadConfig() {
	cfg = cfg.reload();
	return cfg;
}

<% if (options.js === 'TypeScript') { %>
function splitJsAssets(asset) {
	var tsAssets = [],
		jsAssets = [];

	asset.src.forEach(function (value) {
		if (value.indexOf('.ts') !== -1) {
			tsAssets.push(value);
		}
		else {
			jsAssets.push(value);
		}
	});

	return {
		ts: tsAssets,
		js: jsAssets
	};
}<% } %>

function fileExistsSync(filename) {
	// Substitution for the deprecated fs.existsSync() method @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
	try {
		fs.accessSync(filename);
		return true;
	}
	catch (ex) {
		return false;
	}
}

module.exports = {
	fileExistsSync: fileExistsSync,
	getBrowserCompatibility: getBrowserCompatibility,
	getBrowserSyncInstance: getBrowserSyncInstance,
	getSourcePatterns: getSourcePatterns,
	getTask: getTask,
	reloadConfig: reloadConfig,<% if (options.js === 'TypeScript') { %>
	splitJsAssets: splitJsAssets,<% } %>
	updateSourcePatterns: updateSourcePatterns
};
