var express = require('express'),
    app = express(),
    cfg = require('./app/core/config'),
    router = require('./app/core/router'),
    hbs = require('./app/core/hbs');

app.use(router);
app.set('view engine', cfg.sentinel.view_file_extension);
app.set('views', cfg.sentinel.view_directory);
app.engine(cfg.sentinel.view_file_extension, hbs.__express);


var server = app.listen(8080, function() {
    console.log('Sentinel listening on *:8080');
});