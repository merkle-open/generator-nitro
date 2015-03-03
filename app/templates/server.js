var express = require('express'),
    app = express(),
    cfg = require('./app/core/config'),
    router = require('./app/core/router'),
    hbs = require('./app/core/hbs'),
    bodyParser = require('body-parser');

// Loads cusotm project routes
require('./app/core/route_loader')(app);

app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', cfg.splendid.view_file_extension);
app.set('views', cfg.splendid.view_directory);
app.engine(cfg.splendid.view_file_extension, hbs.__express);


var server = app.listen(8080, function() {
    console.log('Splendid listening on *:8080');
});
