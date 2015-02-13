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
    header = require('gulp-header'),
    karma = require('karma').server,
    livereload = require('gulp-livereload');
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
    var assets = getSourceFiles('.css'),
        imports = '';

    assets.deps.forEach(function(src) {
        imports += fs.readFileSync(src)
    });

    return gulp
        .src(assets.src)
        .pipe(debug())
        .pipe(header(imports))
        .pipe(cache(assets.name))
        .pipe(less())
        .pipe(remember(assets.name))
        .pipe(minify())
        .pipe(concat(assets.name))
        .pipe(gulp.dest('public/latest/'))
        .pipe(livereload());
});

gulp.task('compile-js', function() {
    var assets = getSourceFiles('.js');
    return gulp
        .src(assets.src)
        .pipe(debug())
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(key))
        .pipe(uglify())
        .pipe(gulp.dest('./public/latest'))
        .pipe(livereload());
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
    livereload.listen();

    var watcher = gulp.watch(['./assets/**/*.less', './components/**/*.less'], ['compile-less']);
    watcher.on('change', function(e) {
        if ('delete' === e.type) {
            delete cache.caches.scripts[e.path];
            remember.forget('scripts', e.path);
        }
    });
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