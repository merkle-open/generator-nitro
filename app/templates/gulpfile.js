var gulp = require('gulp'),
    path = require('path'), <% if (options.pre === 'less') { %>
    precompile = require('gulp-less'), <% } %><% if (options.pre === 'scss') { %>
    precompile = require('gulp-sass'), <% } %>
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    header = require('gulp-header'),
    karma = require('karma').server,
    server = require('gulp-express'),
    browserSync = require('browser-sync'),
    rename = require("gulp-rename"),
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

gulp.task('compile-css', function () {
    var assets = getSourceFiles('.css'),
        imports = '';

    assets.deps.forEach(function (src) {
        imports += fs.readFileSync(src)
    });

    return gulp
        .src(assets.src)
        .pipe(plumber())
        .pipe(header(imports))
        .pipe(cache(assets.name))
        .pipe(precompile())
        .pipe(remember(assets.name))
        .pipe(concat(assets.name))
        .pipe(gulp.dest('./public/latest/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compile-js', function () {
    var assets = getSourceFiles('.js');

    return gulp
        .src(assets.src)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(assets.name))
        .pipe(gulp.dest('./public/latest'))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('minify-css', ['compile-css'], function () {
    var assets = getSourceFiles('.css');

    return gulp
        .src('./public/latest/' + assets.name)
        .pipe(minify())
        .pipe(rename(assets.name.replace('.css', '.min.css')))
        .pipe(gulp.dest('./public/latest/'));
});

gulp.task('minify-js', ['compile-js'], function () {
    var assets = getSourceFiles('.js');

    return gulp
        .src('./public/latest/' + assets.name)
        .pipe(uglify())
        .pipe(rename(assets.name.replace('.js', '.min.js')))
        .pipe(gulp.dest('./public/latest/'));
});

gulp.task('minify-img', function () {
    gulp
        .src('./assets/img/**/*.*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./assets/img'));
});

gulp.task('watch', ['compile-css', 'compile-js'], function () {
    var clearCache = function (e) {
        if ('delete' === e.type) {
            delete cache.caches.scripts[e.path];
            remember.forget('scripts', e.path);
        }
    };

    gulp.watch([
        './config.json',
        './assets/**/*.<%= options.pre %>',
        './components/**/*.<%= options.pre %>'
    ], ['compile-css'])
    .on('change', function (e) {
        clearCache(e)
    });

    gulp.watch([
        './config.json',
        './assets/**/*.js',
        './components/**/*.js'
    ], ['compile-js'])
    .on('change', function (e) {
        clearCache(e)
    });

    gulp.watch([
        './views/**/*.html',
        './components/**/*.html'
    ])
    .on('change', function (e) {
        browserSync.reload();
    });
});

gulp.task('browser-sync', ['server-watch'], function () {
    browserSync({
        proxy: 'localhost:8080',
        port: 8081
    }, function(err) {
        if (!err) {
            browserSync.notify('Compiling your assets, please wait!');
        }
    });
});

gulp.task('server-run', function () {
    server.run(['./server.js']);
});

gulp.task('server-watch', ['server-run'], function () {
    gulp.watch(['./server.js', './app/core/*.js'], function () {
        server.run(['./server.js']);
    });
});

gulp.task('test', ['compile-css', 'compile-js'], function (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true,
        autoWatch: false
    }, done);
});

gulp.task('develop', ['browser-sync', 'watch']);
gulp.task('production', ['minify-css', 'minify-js', 'server-run']);
