'use strict';

const path = require('path');
const fs = require('fs');

const getCwd = () => fs.realpathSync(process.cwd());
// return relative path to dependency
// and make sure hoisting is supported -> https://github.com/lerna/lerna/blob/master/doc/hoist.md
const getRelativeDependencyPath = (dependency) => path.relative(getCwd(), require.resolve(dependency));

const config = {
	assets: {
		'ui.css': [
			'+src/assets/css/example/variables.scss',
			'+src/assets/css/example/mixins.scss',
			'src/assets/css/example/reset.css',
			'src/assets/css/basic.scss',
			'src/patterns/**/css/*.scss',
			'src/patterns/**/css/modifier/*.scss',
		],
		'ui.js': [
			getRelativeDependencyPath('babel-polyfill/dist/polyfill.min.js'),
			getRelativeDependencyPath('jquery/dist/jquery.min.js'),
			getRelativeDependencyPath('terrific/dist/terrific.min.js'),
			getRelativeDependencyPath('handlebars/dist/handlebars.runtime.min.js'),
			'src/assets/js/*.js',
			'src/patterns/**/js/*.js',
			'src/patterns/**/js/decorator/*.js',
			'src/patterns/**/template/*.js',
			'src/patterns/**/template/partial/*.js',
		],
	},
};

module.exports = config.assets;
