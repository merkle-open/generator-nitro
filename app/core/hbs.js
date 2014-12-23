var fs = require('fs'),
    cfg = require('./config'),
    path = require('path'),
    helpersDir = path.normalize(__dirname + '../../helpers/');

module.exports = function(hbs) {
    hbs.registerPartials(cfg.micro.base_path + cfg.micro.view_partials_directory);

    fs.readdir(helpersDir, function(err, files) {
        if (err) throw err;

        files.forEach(function(file) {
            require(helpersDir + file)(hbs);
        });
    });

};