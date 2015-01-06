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
    debug = require('gulp-debug');

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
                    .pipe(cache('js-compile'))
                    .pipe(debug())
                    .pipe(plumber())
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

gulp.task('watch', ['compile-less', 'compile-js', 'minify-img'], function() {
    watch(
        ['./assets/**/*.css', './assets/**/*.less', './components/**/*.css', './components/**/*.less'],
        function(files, cb) {
            gulp.start('compile-less', cb);
        }
    );

    watch(
        ['./assets/**/*.js', './components/**/*.js'],
        function(files, cb) {
            gulp.start('compile-js', cb);
        }
    );
});

gulp.task('default', ['compile-less', 'compile-js']);