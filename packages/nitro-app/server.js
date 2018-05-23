'use strict';

const express = require('express');
const app = express();
const config = require('config');
const router = require('./app/core/router');
const compression = require('compression');
const bodyParser = require('body-parser');

const isProduction = config.get('server.production');
const isTwig = config.get('nitro.templateEngine') === 'twig';
let engine;

// webpack
if (!isProduction) {
	require('./app/core/webpack')(app);
}

if (isTwig) {
	engine = require('./app/templating/twig/engine');
	engine.cache(false);
} else {
	engine = require('./app/templating/hbs/engine');
	require('./app/templating/hbs/partials')(engine);
}

// compress all requests
app.use(compression());

// translations
require('./app/core/i18n')(app);

// Loads custom project routes
require('./app/core/routeLoader')(app);

app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', config.get('nitro.viewFileExtension'));
app.set('views', config.get('nitro.basePath') + config.get('nitro.viewDirectory'));

if (isTwig) {
	app.engine(config.get('nitro.viewFileExtension'), engine.renderWithLayout);
} else {
	app.engine(config.get('nitro.viewFileExtension'), engine.__express);
}

require('./app/core/listen')(app);
