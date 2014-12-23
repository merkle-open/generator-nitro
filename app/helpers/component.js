var fs = require('fs'),
    path = require('path'),
    cfg = require('../core/config.js');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function (hbs) {
    hbs.registerHelper('component', function (modName, variant) {

        for (var key in cfg.micro.components) {
            var component = cfg.micro.components[key];
            if (component.hasOwnProperty('path')) {
                var filename = modName.toLowerCase() + '.' + cfg.micro.view_file_extension;;

                if ('string' === typeof variant) {
                    filename = modName.toLowerCase() + '-' + variant.toLowerCase() + '.' + cfg.micro.view_file_extension;
                }

                var fullPath = path.join(
                    cfg.micro.base_path,
                    component.path,
                    '/',
                    capitalize(modName),
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

        throw new Error('Component ' + modName + ' not found. (Hint: have you added it to config.json?)');
    });
};