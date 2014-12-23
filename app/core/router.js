var path = require('path'),
    fs = require('fs'),
    cfg = require('./config'),
    express = require('express'),
    router = express.Router({
        caseSensitive: false,
        strict: false
    });

router.use('/', express.static(cfg.micro.base_path + '/assets/'));

/**
 * TODO: List views if no index
 */
router.get('/', function(req, res) {
    var tplPath = path.join(
        cfg.micro.view_directory,
        'index.' + cfg.micro.view_file_extension
    );

    fs.exists(tplPath, function(exists) {
        if (exists) {
            res.render('index');
        } else {
            res.status(404);
            res.send('Not Found. (Please add an index template)');
        }
    });
});

/**
 * TODO: Nice looking 404?
 */
router.get('/:view', function(req, res) {
    var tplName = req.params.view.toLowerCase().replace(/-/g, '/'),
        tplPath = path.join(
            cfg.micro.view_directory,
            '/',
            tplName + '.' + cfg.micro.view_file_extension
        );

    fs.exists(tplPath, function(exists) {
        if (exists) {
            res.render(tplName);
        } else {
            res.status(404);
            res.send('Not Found.');
        }
    });
});

/**
 * TODO: Terrific Template in /app
 */
router.get('/terrific/', function(req, res) {
    res.send('Terrific GUI');
});

module.exports = router;