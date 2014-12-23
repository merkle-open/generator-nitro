var fs = require('fs'),
    path = require('path'),
    merge = require('merge'),
    config = require('../../config.json');

var defaultConfig = {
    base_path: path.normalize(__dirname + '../../../'),
    view_directory: path.normalize(__dirname + '../../../') + 'views',
    view_file_extension: 'html',
    view_partials_directory: 'views/partials'
};

config.micro = config.micro || defaultConfig;

config.micro = merge(defaultConfig, config.micro);

module.exports = config;