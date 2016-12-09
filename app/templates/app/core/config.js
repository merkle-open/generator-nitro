'use strict';

const path = require('path');
const fs = require('fs');
const extend = require('extend');

function factory() {
	const basePath = path.normalize(path.join(__dirname, '../../'));
	const options = {
		encoding: 'utf-8',
		flag: 'r',
	};
	let config = JSON.parse(fs.readFileSync(`${basePath}config.json`, options));

	config.nitro = extend(true, {
		base_path: basePath,
		view_directory: 'views',
		view_file_extension: '<%= options.viewExt %>',
		view_partials_directory: 'views/_partials',
		view_data_directory: 'views/_data',
		view_layouts_directory: 'views/_layouts',
		placeholders_directory: 'views/_placeholders',
		default_layout: 'default',
	}, config.nitro);

	config.code = extend(true, {
		compatibility: {
			browsers: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1',],
		}
	}, config.code);

	config.server = {
		port: process.env.PORT || 8080,
		proxy: process.env.PROXY || 8081,
		// windows may have white spaces in env var
		production: process.env.NODE_ENV && process.env.NODE_ENV.replace((/\s/g), '') === 'production',
	};

	config.reload = function () {
		return factory();
	};

	return config;
}

module.exports = factory();
