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

function each(cfgs, fn) {
	if (cfgs.length) {
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
	each,
};
