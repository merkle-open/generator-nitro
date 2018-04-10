'use strict';

const express = require('express');
const app = express();
const config = require('config');
const router = require('./app/core/router');
const hbs = require('./app/templating/hbs/engine');
const compression = require('compression');
const bodyParser = require('body-parser');

// partials
require('./app/templating/hbs/partials')(hbs);

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
app.engine(config.get('nitro.viewFileExtension'), hbs.__express);

require('./app/core/listen')(app);
