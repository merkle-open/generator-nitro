var express = require('express'),
    app = express(),
    cfg = require('./app/core/config'),
    router = require('./app/core/router'),
    hbs = require('./app/core/hbs'),
    bodyParser = require('body-parser'),
	port = process.env.PORT || 8080;

// Loads custom project routes
require('./app/core/routeLoader')(app);

app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', cfg.splendid.view_file_extension);
app.set('views', cfg.splendid.view_directory);
app.engine(cfg.splendid.view_file_extension, hbs.__express);


app.listen(port, function() {
    console.log('Splendid listening on *:%s', port);
});
