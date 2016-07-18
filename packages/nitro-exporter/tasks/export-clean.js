const del = require('del');

module.exports = (config) => function () {
	return del(`${config.exporter.dest}/**/*`);
};
