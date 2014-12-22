var fs = require('fs'),
    path = require('path');

function getConfig(basePath) {
    var config = require('../config.json');

    config.micro = config.micro || {};
    config.micro.base_path = basePath;
    config.micro.view_directory = path.join(basePath + '/' + config.micro.view_directory) || basePath + '/views';
    config.micro.view_file_extension = config.micro.view_file_extension || 'html';
    config.micro.view_partials_directory = config.micro.view_partials_directory || 'views/partials';

    return config;
}

module.exports = function(basePath) {
    return getConfig(basePath);
};