'use strict';

const config = require('config');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

function getTask(task) {
	const gulpFunction = require(`../tasks/${task}`)(gulp, plugins);
	gulpFunction.displayName = task;
	return gulpFunction;
}

function getProjectPath() {
	return config.get('nitro.basePath');
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
	getTask,
	getProjectPath,
	each,
};
