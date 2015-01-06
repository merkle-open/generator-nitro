var fs = require('fs'),
    path = require('path'),
    hbs = require('hbs'),
    cfg = require('./config'),
    helpersDir = path.normalize(__dirname + '../../helpers/');

hbs.registerPartials(cfg.micro.base_path + cfg.micro.view_partials_directory);

var files = fs.readdirSync(helpersDir);
files.forEach(function(file) {
    var name = path.basename(helpersDir + file, '.js');
    hbs.registerHelper(name, require(helpersDir + file));
});
module.exports = hbs;