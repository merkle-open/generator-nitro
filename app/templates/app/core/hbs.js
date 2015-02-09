var fs = require('fs'),
    path = require('path'),
    hbs = require('hbs'),
    cfg = require('./config'),
    helpersDir = cfg.sentinel.base_path + 'project/helpers/';

hbs.registerPartials(cfg.sentinel.base_path + cfg.sentinel.view_partials_directory);

var files = fs.readdirSync(helpersDir);
files.forEach(function(file) {
    if ('.js' === path.extname(file)) {
        var name = path.basename(helpersDir + file, '.js');
        hbs.registerHelper(name, require(helpersDir + file));
    }
});
module.exports = hbs;