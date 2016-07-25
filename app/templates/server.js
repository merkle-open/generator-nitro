var express = require('express');
var app = express();
var config = require('./app/core/config');
var router = require('./app/core/router');
var hbs = require('./app/core/hbs');
var compression = require('compression');
var bodyParser = require('body-parser');

// partials
require('./app/core/hbs-partials')(hbs);

// compress all requests
app.use(compression());

// translations
require('./app/core/i18n')(app);

// Loads custom project routes
require('./app/core/routeLoader')(app);

app.use(router);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', config.nitro.view_file_extension);
app.set('views', config.nitro.base_path + config.nitro.view_directory);
app.engine(config.nitro.view_file_extension, hbs.__express);

require('./app/core/listen')(app);
