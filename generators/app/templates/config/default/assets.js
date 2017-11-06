'use strict';

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
			'node_modules/babel-polyfill/dist/polyfill.min.js',
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/terrific/dist/terrific.min.js',<% if (options.clientTpl) { %>
			'node_modules/handlebars/dist/handlebars.runtime.min.js',<% } %>
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
