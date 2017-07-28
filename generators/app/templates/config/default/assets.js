'use strict';

const config = {
	assets: {
		'app.css': [<% if (options.exampleCode) { %>
			'+assets/css/example/variables.<%= options.pre %>',
			'+assets/css/example/mixins.<%= options.pre %>',
			'assets/css/example/reset.css',<% } %>
			'assets/css/basic.<%= options.pre %>',
			'patterns/**/css/*.<%= options.pre %>',
			'patterns/**/css/modifier/*.<%= options.pre %>',
		],
		'app.js': [
			'node_modules/babel-polyfill/dist/polyfill.min.js',
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/terrific/dist/terrific.min.js',<% if (options.clientTpl) { %>
			'node_modules/handlebars/dist/handlebars.runtime.min.js',<% } %>
			'assets/js/*.js',<% if (options.js === 'TypeScript') { %>
			'assets/js/*.ts',
			'patterns/**/js/*.ts',
			'patterns/**/js/decorator/*.ts',<% } else { %>
			'patterns/**/js/*.js',
			'patterns/**/js/decorator/*.js',<% } %><% if (options.clientTpl) { %>
			'patterns/**/template/*.js',
			'patterns/**/template/partial/*.js',<% } %>
		],
	},
};

module.exports = config.assets;
