var cfg = require('../app/core/config');
var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync;

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

function getSourceFiles(ext) {
	var assets = [];

	for (var key in cfg.assets) {
		if (cfg.assets.hasOwnProperty(key) && ext === path.extname(key)) {
			var asset = cfg.assets[key],
				result = {
					name: key,
					deps: [],
					src:  []
				};

			for (var fkey in asset) {
				if (asset.hasOwnProperty(fkey)) {
					var filepath = asset[fkey];
					if (filepath.indexOf('+') === 0) {
						result.deps.push(filepath.substr(1));
					}
					else {
						result.src.push(filepath);
					}
				}
			}

			assets.push(result);
		}
	}

	return assets;
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

module.exports = {
	getBrowserCompatibility: getBrowserCompatibility,
	getBrowserSyncInstance: getBrowserSyncInstance,
	getSourceFiles: getSourceFiles,
	getTask: getTask,
	reloadConfig: reloadConfig<% if (options.js === 'TypeScript') { %>,
	splitJsAssets: splitJsAssets<% } %>
};
