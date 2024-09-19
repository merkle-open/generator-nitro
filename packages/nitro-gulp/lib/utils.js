'use strict';

const config = require('config');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
let browserSync;

function getBrowserSyncInstance() {
	const name = `Nitro${config.get('server.port')}`;
	if (!browserSync) {
		browserSync = require('browser-sync').create(name);
	}
	return browserSync;
}

function getTask(task) {
	const gulpFunction = require(`../tasks/${task}`)(gulp, plugins);
	gulpFunction.displayName = task;
	return gulpFunction;
}

function getProjectPath() {
	return config.get('nitro.basePath');
}

// load optional package
function getOptionalPackage(x) {
	let mod;
	try {
		mod = require(x);
	} catch (error) {
		mod = null;
	}
	return mod;
}

function each(cfgs, fn) {
	if (Array.isArray(cfgs)) {
		cfgs.forEach((cfg) => {
			fn(cfg);
		});
	} else {
		fn(cfgs);
	}
}

module.exports = {
	getBrowserSyncInstance,
	getTask,
	getProjectPath,
	getOptionalPackage,
	each,
};
