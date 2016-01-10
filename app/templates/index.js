var fs = require('fs');
var hbs = require('hbs');
var config = require('nitro/config')(
	require('nitro/config-reader')(__dirname)
);
var nitro = require('nitro')(config);
var hbs = require('nitro/hbs');

var port = 8080;

nitro.addHelper('i18n');

nitro.start(port, function(app) {
	hbs(app, config);
	console.log('Nitro listening on *:%s', port);
});