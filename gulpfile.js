var gulp = require('gulp'),
    path = require('path'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    debug = require('gulp-debug'),
    karma = require('karma').server,
    header = require('gulp-header'),
    fs = require('fs');

function getSourceFiles(ext) {
    var assets = require('./config.json').assets;
    for (var key in assets) {
        if (assets.hasOwnProperty(key) && ext === path.extname(key)) {
            var asset = assets[key],
                result = {
                    name: key,
                    deps: [],
                    src: []
                };

            for (var fkey in asset) {
                var filepath = asset[fkey];
                if (filepath.indexOf('+') === 0) {
                    result.deps.push(filepath.substr(1));
                } else {
                    result.src.push(filepath);
                }
            }

            return result;
        }
    }

    return [];
}

gulp.task('compile-less', function() {
    var assets = require('./config.json').assets;

    for (var key in assets) {
        if (assets.hasOwnProperty(key)) {
            var asset = assets[key];
            if ('.css' === path.extname(key)) {
                gulp
                    .src(asset)
                    .pipe(cache('less-compile'))
                    .pipe(debug())
                    .pipe(plumber())
                    .pipe(less())
                    .pipe(minify())
                    .pipe(concat(key))
                    .pipe(
                        gulp.dest('./public/latest/')
                    );
            }
        }
    }
});

gulp.task('compile-js', function() {
    var assets = require('./config.json').assets;

    for (var key in assets) {
        if (assets.hasOwnProperty(key)) {
            var asset = assets[key];
            if ('.js' === path.extname(key)) {
                gulp
                    .src(asset)
                    .pipe(debug())
                    .pipe(plumber())
                    .pipe(cache(key)
                    .pipe(jshint())
                    .pipe(jshint.reporter('jshint-stylish'))
                    .pipe(concat(key))
                    .pipe(uglify())
                    .pipe(
                        gulp.dest('./public/latest')
                    );
            }
        }
    }
});

gulp.task('minify-img', function() {
    // TODO: Move files to resources/original before minify
    gulp
        .src('./assets/img/**/*.*')
        .pipe(debug())
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./assets/img'));
});

gulp.task('watch', ['compile-less'], function() {
    var watcher = gulp.watch(['./assets/**/*.less', './components/**/*.less'], ['compile-less']);
    watcher.on('change', function(e) {
        if ('delete' === e.type) {
            delete cache.caches.scripts[e.path];
            remember.forget('scripts', e.path);
        }
    );

    watch(
        ['./assets/**/*.js', './components/**/*.js'],
        function(files, cb) {
            gulp.start('compile-js', cb);
        }
    );
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', ['compile-less', 'compile-js']);