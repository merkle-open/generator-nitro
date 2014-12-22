var express = require('express'),
    app = express(),
    hbs = require('hbs'),
    cfg = require('./app/config')(__dirname),
    fs = require('fs'),
    path = require('path');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

hbs.registerPartials(cfg.micro.base_path + '/' + cfg.micro.view_partials_directory);
hbs.registerHelper('component', function(modName) {
    var fullModPath = path.join(
        cfg.micro.base_path,
        cfg.micro.components.module.path,
        '/',
        modName.capitalize(),
        '/',
        modName.toLowerCase() + '.' + cfg.micro.view_file_extension
    );

    return new hbs.handlebars.SafeString(
        hbs.handlebars.compile(
            fs.readFileSync(fullModPath, 'utf8')
        ).call()
    );
});

app.set('view engine', cfg.micro.view_file_extension);
app.set('views', cfg.micro.view_directory);
app.engine(cfg.micro.view_file_extension, hbs.__express);

app.use('/', express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
    var tplPath = path.join(
        cfg.micro.view_directory,
        'index.' + cfg.micro.view_file_extension
    );

    fs.exists(tplPath, function(exists) {
        console.log(tplPath);
        if (exists) {
            res.render('index', { pageTitle: 'Terrific Micro on Node' });
        } else {
            res.status(404);
            res.send('Not Found.');
        }
    });
});

app.get('/:view', function(req, res) {
    var tplPath = path.join(
        cfg.micro.view_directory,
        req.params.view + '.' + cfg.micro.view_file_extension
    );

    fs.exists(tplPath, function(exists) {
        console.log(tplPath);
        if (exists) {
            res.render(req.params.view, { pageTitle: 'Terrific Micro: ' +  req.params.view.capitalize() });
        } else {
            res.status(404);
            res.send('Not Found.');
        }
    });
});

var server = app.listen(8080, function() {
    console.log('Terrific Micro listening on *:8080');
});