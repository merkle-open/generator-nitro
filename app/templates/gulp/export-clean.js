var config = require('../app/core/config.js');
var del = require('del');

module.exports = function (gulp, plugins) {
	return function () {
		return del(config.exporter.dest + '/**/*');
	};
};
