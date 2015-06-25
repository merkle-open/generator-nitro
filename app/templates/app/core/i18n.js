var i18n = require('i18next');

var options = {
	//supportedLngs: ['en', 'de'],
	//lng: 'de-CH',
	fallbackLng: 'default',
	detectLngQS: 'lang',
	detectLngFromPath: false,
	useCookie: false,
	resGetPath: 'project/locales/__lng__/__ns__.json',
	ignoreRoutes: ['api/', 'assets/'],
	debug: false
};

i18n.init(options);

exports = module.exports = function (app) {
	app.use(i18n.handle);
};
