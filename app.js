var express = require('express'),
    app = express(),
    cfg = require('./app/core/config'),
    router = require('./app/core/router'),
    hbs = require('./app/core/hbs');

app.use(router);
app.set('view engine', cfg.micro.view_file_extension);
app.set('views', cfg.micro.view_directory);
app.engine(cfg.micro.view_file_extension, hbs.__express);


var server = app.listen(8080, function() {
    console.log('Terrific Micro listening on *:8080');
});