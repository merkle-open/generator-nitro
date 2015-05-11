var fs = require('fs'),
	hbs = require('hbs'),
	path = require('path'),
	cfg = require('../core/config.js');

module.exports = function (modName, variant) {
	for (var key in cfg.nitro.components) {
		if (cfg.nitro.components.hasOwnProperty(key)) {
			var component = cfg.nitro.components[key];
			if (component.hasOwnProperty('path')) {
				var filename = modName.toLowerCase() + '.' + cfg.nitro.view_file_extension;

				if ('string' === typeof variant) {
					filename = modName.toLowerCase() + '-' + variant.toLowerCase() + '.' + cfg.nitro.view_file_extension;
				}

				var fullPath = path.join(
					cfg.nitro.base_path,
					component.path,
					'/',
					modName,
					'/',
					filename
				);

				if (fs.existsSync(fullPath)) {
					return new hbs.handlebars.SafeString(
						hbs.handlebars.compile(
							fs.readFileSync(fullPath, 'utf8')
						).call()
					);
				}
			}
		}
	}

	throw new Error('Component ' + modName + ' not found. (Hint: have you added it to config.json?)');
};
