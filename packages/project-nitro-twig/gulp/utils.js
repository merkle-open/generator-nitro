'use strict';

const config = require('config');
const path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
let browserSync;
let assets = {};

function getBrowserSyncInstance() {
	const name = `Nitro${config.get('server.port')}`;
	if (config.get('nitro.mode.livereload') && !browserSync) {
		browserSync = require('browser-sync').create(name);
	}
	return browserSync;
}

function getSourcePatterns(ext) {
	const type = typeof ext === 'string' && (ext === 'js' || ext === 'css') ? ext : null;

	if (!assets.hasOwnProperty('js') || !assets.hasOwnProperty('css')) {
		updateSourcePatterns();
	}

	return type ? assets[type] : assets;
}

function updateSourcePatterns() {
	let key, ext, type, asset, result, patternKey, patternPath;

	assets = {
		css: [],
		js: [],
	};

	for (key in config.get('assets')) {
		if (config.assets.hasOwnProperty(key)) {
			ext = path.extname(key);
			if (ext) {
				type = ext.replace(/[^a-z]/g, '');
				asset = config.assets[key];
				result = {
					name: key,
					deps: [],
					src: [],
				};

				for (patternKey in asset) {
					if (asset.hasOwnProperty(patternKey)) {
						patternPath = asset[patternKey];
						if (patternPath.indexOf('+') === 0) {
							result.deps.push(patternPath.substr(1));
						} else {
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

function getTmpDirectory(subPath) {
	let tmpPath = 'project/tmp';
	if (subPath && typeof subPath === 'string') {
		tmpPath += `/${subPath}`;
	}
	return tmpPath;
}

module.exports = {
	getBrowserSyncInstance,
	getSourcePatterns,
	getTask,
	getTmpDirectory,
	updateSourcePatterns,
};
