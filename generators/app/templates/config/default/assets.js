'use strict';

const path = require('path');
const fs = require('fs');

const getCwd = () => fs.realpathSync(process.cwd());
// return relative path to dependency
// and make sure hoisting is supported -> https://github.com/lerna/lerna/blob/master/doc/hoist.md
const getRelativeDependencyPath = (dependency) => path.relative(getCwd(), require.resolve(dependency));

const config = {
	assets: {
		'app.css': [<% if (options.exampleCode) { %>
			'+src/assets/css/example/variables.<%= options.pre %>',
			'+src/assets/css/example/mixins.<%= options.pre %>',
			'src/assets/css/example/reset.css',<% } %>
			'src/assets/css/basic.<%= options.pre %>',
			'src/patterns/**/css/*.<%= options.pre %>',
			'src/patterns/**/css/modifier/*.<%= options.pre %>',
		],
		'app.js': [
			getRelativeDependencyPath('babel-polyfill/dist/polyfill.min.js'),
			getRelativeDependencyPath('jquery/dist/jquery.min.js'),
			getRelativeDependencyPath('terrific/dist/terrific.min.js'),<% if (options.clientTpl) { %>
			getRelativeDependencyPath('handlebars/dist/handlebars.runtime.min.js'),<% } %>
			'src/assets/js/*.js',<% if (options.js === 'TypeScript') { %>
			'src/assets/js/*.ts',
			'src/patterns/**/js/*.ts',
			'src/patterns/**/js/decorator/*.ts',<% } else { %>
			'src/patterns/**/js/*.js',
			'src/patterns/**/js/decorator/*.js',<% } %><% if (options.clientTpl) { %>
			'src/patterns/**/template/*.js',
			'src/patterns/**/template/partial/*.js',<% } %>
		],
	},
};

module.exports = config.assets;
