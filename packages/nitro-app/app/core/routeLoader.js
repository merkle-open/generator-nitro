'use strict';

const config = require('config');
const fs = require('fs');
const path = require('path');
const routePath = `${config.get('nitro.basePath')}project/routes/`;
const viewDataPath = `${config.get('nitro.basePath')}project/viewData/`;
const routers = [];

function readRoutes(routes) {
	fs.readdirSync(routes).sort().forEach((el) => {
		if (path.extname(el) === '.js') {
			routers.push(require(routes + path.basename(el, '.js')));
		}
	});
}

if (config.get('server.loadViewDataBeforeRoutes')) {
	readRoutes(viewDataPath);
	readRoutes(routePath);
} else {
	readRoutes(routePath);
	readRoutes(viewDataPath);
}

module.exports = function (app) {
	routers.forEach((routedefinition) => {
		routedefinition(app);
	});
};
