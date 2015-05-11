var cfg = require('./config'),
	fs = require('fs'),
	path = require('path'),
	routePath = cfg.nitro.base_path + 'project/routes/',
	additionalRoutes = fs.readdirSync(routePath),
	routers = [];

additionalRoutes.forEach(function (el) {
	if ('.js' === path.extname(el)) {
		routers.push(require(routePath + path.basename(el, '.js')));
	}
});

exports = module.exports = function (app) {
	routers.forEach(function (routedefinition) {
		routedefinition(app);
	});
};
