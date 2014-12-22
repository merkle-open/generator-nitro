var gulp = require('gulp'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin');

gulp.task('compile-css', function() {
    gulp.src(
        [
            './assets/css/variables.less',
            './assets/css/mixins.less',
            './assets/vendor/bootstrap/less/bootstrap.less',
            './components/**/*.less'
        ]
    )
        .pipe(plumber())
        .pipe(less())
        .pipe(minify())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./public/latest/'));
});

gulp.task('compile-js', function() {
    gulp.src('./components/**/*.js').pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
    gulp.src(
        [
            './assets/vendor/jquery/dist/jquery.min.js',
            './assets/vendor/bootstrap/js/*.jsg',
            './assets/js/**/*.js',
            './components/**/*.js'
        ]
    )
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/latest'));
});

gulp.task('image-minify', function() {
    gulp.src('./assets/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.desct('./public/latest/img'));
});

gulp.task('watch', ['compile-css', 'compile-js'], function() {
    watch(
        ['./assets/**/*.css', './assets/**/*.less', './components/**/*.css', './components/**/*.less'],
        function(files, cb) {
            gulp.start('compile-css', cb);
        }
    );

    watch(
        ['./assets/**/*.js', './components/**/*.js'],
        function(files, cb) {
            gulp.start('compile-js', cb);
        }
    );
});

gulp.task('default', ['compile-css', 'compile-js']);