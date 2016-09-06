'use strict';

const config = require('./config');
const fs = require('fs');
const path = require('path');
const routePath = config.nitro.base_path + 'project/routes/';
const viewDataPath = config.nitro.base_path + 'project/viewData/';
let routers = [];

function readRoutes(routes){
	fs.readdirSync(routes).forEach((el) => {
		if ('.js' === path.extname(el)) {
			routers.push(require(routes + path.basename(el, '.js')));
		}
	});
}

readRoutes(routePath);
readRoutes(viewDataPath);

module.exports = function (app) {
	routers.forEach((routedefinition) => {
		routedefinition(app);
	});
};
