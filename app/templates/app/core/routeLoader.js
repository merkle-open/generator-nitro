var config = require('./config');
var fs = require('fs');
var path = require('path');
var routePath = config.nitro.base_path + 'project/routes/';
var viewDataPath = config.nitro.base_path + 'project/viewData/';
var routers = [];

function readRoutes(routes){
	fs.readdirSync(routes).forEach(function (el) {
		if ('.js' === path.extname(el)) {
			routers.push(require(routes + path.basename(el, '.js')));
		}
	});
}

readRoutes(routePath);
readRoutes(viewDataPath);

module.exports = function (app) {
	routers.forEach(function (routedefinition) {
		routedefinition(app);
	});
};
