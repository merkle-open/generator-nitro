var fs = require('fs'),
    path = require('path'),
    cfg = require('../core/config.js');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = function(hbs) {
    hbs.registerHelper('component', function (modName) {
        var fullModPath = path.join(
            cfg.micro.base_path,
            cfg.micro.components.module.path,
            '/',
            capitalize(modName),
            '/',
            modName.toLowerCase() + '.' + cfg.micro.view_file_extension
        );

        return new hbs.handlebars.SafeString(
            hbs.handlebars.compile(
                fs.readFileSync(fullModPath, 'utf8')
            ).call()
        );
    });
};