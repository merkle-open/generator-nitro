var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	cfg = require('../core/config.js');

module.exports = function(modName, variant, options) {
	for (var key in cfg.splendid.components) {
		var component = cfg.splendid.components[key];
		if (component.hasOwnProperty('path')) {
			var filename = modName.toLowerCase() + '.' + cfg.splendid.view_file_extension;

			if ('string' === typeof variant) {
				filename = modName.toLowerCase() + '-' + variant.toLowerCase() + '.' + cfg.splendid.view_file_extension;
			}

			var fullPath = path.join(
				cfg.splendid.base_path,
				component.path,
				'/',
				modName,
				'/',
				filename
			);

			if (fs.existsSync(fullPath)) {
				var dataObj = {};
				if(options && options.hash){
					for (var attributeName in options.hash) {
						dataObj[attributeName] = options.hash[attributeName];
					}
				}
				return new hbs.handlebars.SafeString(
					hbs.handlebars.compile(
						fs.readFileSync(fullPath, 'utf8')
					)(dataObj)
				);
			}
		}
	}

	throw new Error('Component ' + modName + ' not found. (Hint: have you added it to config.json?)');
};
