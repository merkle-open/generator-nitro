'use strict';

const express = require('express');
const app = express();
const config = require('config');
const router = require('../core/router');
const compression = require('compression');
const bodyParser = require('body-parser');

const isProduction = config.get('server.production');
const useCompression = config.get('server.compression');
const isTwig = config.get('nitro.templateEngine') === 'twig';
let engine;

// webpack
if (!isProduction) {
	require('../core/webpack')(app);
}

if (isTwig) {
	engine = require('../templating/twig/engine');
	engine.cache(false);
} else {
	engine = require('../templating/hbs/engine');
	require('../templating/hbs/partials')(engine);
}

// compress all requests
if (useCompression) {
	app.use(compression());
}

// translations
require('../core/i18n')(app);

// Loads custom project routes
require('../core/routeLoader')(app);

app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', config.get('nitro.viewFileExtension'));
app.set('views', config.get('nitro.basePath') + config.get('nitro.viewDirectory'));

if (isTwig) {
	app.engine(config.get('nitro.viewFileExtension'), engine.renderWithLayout);
} else {
	app.engine(config.get('nitro.viewFileExtension'), engine.__express);
}

require('../core/listen')(app);
