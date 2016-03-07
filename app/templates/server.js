var express = require('express'),
	app = express(),
	config = require('./app/core/config'),
	router = require('./app/core/router'),
	hbs = require('./app/core/hbs'),
	compression = require('compression'),
	bodyParser = require('body-parser');

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
