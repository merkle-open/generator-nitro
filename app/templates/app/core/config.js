var path = require('path'),
	fs = require('fs'),
	merge = require('merge');

function factory() {
	var base_path = path.normalize(__dirname + '../../../'),
		options = {
			encoding: 'utf-8',
			flag: 'r'
		};

	var config = JSON.parse(fs.readFileSync(base_path + 'config.json', options));
	config.nitro = merge({
		base_path: path.normalize(__dirname + '../../../'),
		view_directory: path.normalize(__dirname + '../../../') + 'views',
		view_file_extension: 'html',
		view_partials_directory: 'views/_partials'
	}, config.nitro);

	config.reload = function() {
		return factory();
	};

	return config;
}

module.exports = factory();