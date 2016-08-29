'use strict';

let cfg = require('../app/core/config');
const path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
let browserSync;
let assets = {};

function getBrowserCompatibility() {
	return cfg.code.compatibility.browsers;
}

function getBrowserSyncInstance() {
	const name = 'Nitro' + cfg.server.port;
	if (!browserSync) {
		browserSync = require('browser-sync').create(name);
	}
	return browserSync;
}

function getSourcePatterns(ext) {
	const type = typeof ext === 'string' && ( ext === 'js' || ext === 'css' ) ? ext : null;

	if (!assets.hasOwnProperty('js') || !assets.hasOwnProperty('css')) {
		updateSourcePatterns();
	}

	return type ? assets[type] : assets;
}

function updateSourcePatterns() {
	let key, ext, type, asset, result, patternKey, patternPath;

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
					src: []
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
	let tsAssets = [];
	let jsAssets = [];

	asset.src.forEach((value) => {
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
	getSourcePatterns: getSourcePatterns,
	updateSourcePatterns: updateSourcePatterns,
	getTask: getTask,
	reloadConfig: reloadConfig<% if (options.js === 'TypeScript') { %>,
	splitJsAssets: splitJsAssets<% } %>
};
