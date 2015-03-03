var cfg = require('./config'),
    fs = require('fs'),
    path = require('path'),
    routePath = cfg.splendid.base_path + 'project/routes/',
    additionalRoutes = fs.readdirSync(routePath),
    routers = [];

additionalRoutes.forEach(function(el) {
    if ('.js' === path.extname(el)) {
        routers.push(require(routePath + path.basename(el, '.js')));
    }
});

module.exports = function(app) {
    routers.forEach(function(el) {
        app.use(el);
    });
};