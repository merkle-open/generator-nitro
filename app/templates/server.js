var express = require('express');
var app = express();
var config = require('./app/core/config');
var router = require('./app/core/router');
var compression = require('compression');
var bodyParser = require('body-parser');
<% if (options.templateEngine === 'handlebars') {%>
var hbs = require('./app/templating/hbs/engine');
app.engine(config.nitro.view_file_extension, hbs.__express);
<% } %>
<% if (options.templateEngine === 'handlebars') {%>
var twig = require('./app/templating/twig/engine');
twig.cache(false);
app.engine(config.nitro.view_file_extension, twig.__express);
<% } %>

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

require('./app/core/listen')(app);
