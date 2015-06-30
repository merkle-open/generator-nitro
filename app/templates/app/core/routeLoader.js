var cfg = require('./config'),
	fs = require('fs'),
	path = require('path'),
	routePath = cfg.nitro.base_path + 'project/routes/',
	viewDataPath = cfg.nitro.base_path + 'project/viewData/',
	routers = [];

function readRoutes(routes){
	fs.readdirSync(routes).forEach(function (el) {
		if ('.js' === path.extname(el)) {
			routers.push(require(routes + path.basename(el, '.js')));
		}
	});
}

readRoutes(routePath);
readRoutes(viewDataPath);

exports = module.exports = function (app) {
	routers.forEach(function (routedefinition) {
		routedefinition(app);
	});
};
