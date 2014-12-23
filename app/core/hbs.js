var fs = require('fs'),
    path = require('path'),
    hbs = require('hbs'),
    cfg = require('./config'),
    helpersDir = path.normalize(__dirname + '../../helpers/');

module.exports = function(hbs, cb) {
    hbs.registerPartials(cfg.micro.base_path + cfg.micro.view_partials_directory);

    fs.readdir(helpersDir, function(err, files) {
        if (err) throw err;

        files.forEach(function(file) {
            require(helpersDir + file).register(hbs);
        });

        if ('function' === typeof cb) {
            cb();
        }
    });

};

