var gulp = require('gulp'),
	path = require('path'), <% if (options.pre === 'less') { %>
	precompile = require('gulp-less'), <% } %><% if (options.pre === 'scss') { %>
	precompile = require('gulp-sass'), <% } %>
	minify = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	install = require('gulp-install'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	jshint = require('gulp-jshint'),
	newer = require('gulp-newer'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cached'),
	remember = require('gulp-remember'),
	header = require('gulp-header'),
	globby = require('globby'),
	karma = require('karma').server,
	liveServer = require('gulp-live-server'),
	browserSync = require('browser-sync'),
	compression = require('compression'),
	rename = require('gulp-rename'),<% if (options.js === 'TypeScript') { %>
	ts = require('gulp-typescript'), <% } %>
	fs = require('fs'),
	del = require('del'),
	Promise = require('es6-promise').Promise,
	cfg = require('./app/core/config');


function getSourceFiles(ext) {
	var assets = [];

	for (var key in cfg.assets) {
		if (cfg.assets.hasOwnProperty(key) && ext === path.extname(key)) {
			var asset = cfg.assets[key],
				result = {
					name: key,
					deps: [],
					src:  []
				};

			for (var fkey in asset) {
				if (asset.hasOwnProperty(fkey)) {
					var filepath = asset[fkey];
					if (filepath.indexOf('+') === 0) {
						result.deps.push(filepath.substr(1));
					}
					else {
						result.src.push(filepath);
					}
				}
			}

			assets.push(result);
		}
	}

	return assets;
}

gulp.task('compile-css', function () {
	var assets = getSourceFiles('.css');
	var promises = [];

	assets.forEach(function (asset) {
		promises.push(new Promise(function(resolve) {
			globby(asset.deps).then(function(paths) {
				var imports = '';

				paths.forEach(function(path) {
					imports += fs.readFileSync(path);
				});

				gulp.src(asset.src)
					.pipe(plumber())
					.pipe(header(imports))
					.pipe(cache(asset.name))
					<% if (options.pre === 'scss') { %>.pipe(precompile().on('error', precompile.logError ))<% } else { %>.pipe(precompile().on('error', function(err) {
						console.log(err.message);
						this.emit('end');
					}))<% } %>
					.pipe(autoprefixer({
						browsers: ['> 1%', 'last 2 versions', 'ie 9', 'android 4', 'Firefox ESR', 'Opera 12.1'],
						cascade: true
					}))
					.pipe(remember(asset.name))
					.pipe(concat(asset.name))
					.pipe(gulp.dest('public/assets/css/'))
					.on('end', function() {
						resolve();
					})
					.pipe(browserSync.reload({stream: true}));
			});
		}));
	});

	return Promise.all(promises);
});

<% if (options.js === 'TypeScript') { %>
	function splitJsAssets(asset) {
		var tsAssets = [],
			jsAssets = [];

		asset.src.forEach(function (value) {
			if (value.indexOf('.ts') !== -1) {
				tsAssets.push(value);
			} else {
				jsAssets.push(value);
			}
		});

		return {
			ts: tsAssets,
			js: jsAssets
		};
	}

	gulp.task('compile-ts', function(){
		var assets = getSourceFiles('.js');

		var tsDefinition = {
			typescript: require('typescript'),
			declarationFiles: false,
			removeComments: true,
			target: 'ES5'
		};

		var promises = [];

		assets.forEach(function (asset) {
			var assets = splitJsAssets(asset);

			promises.push(new Promise(function(resolve) {
				gulp.src(assets.ts)
					.pipe(plumber())
					.pipe(ts(tsDefinition))
					.js
					.pipe(concat(asset.name.replace('.js', '.ts.js')))
					.pipe(gulp.dest('public/assets/js'))
					.on('end', function() {
						resolve();
					});
			}));
		});

		return Promise.all(promises);
	});
<% } %>

gulp.task('compile-js', <% if (options.js === 'TypeScript') { %>['compile-ts'], <% } %>function () {
	var assets = getSourceFiles('.js');
	var promises = [];

	assets.forEach(function (asset) {
		<% if (options.js === 'TypeScript') { %>
			var tsAssets = splitJsAssets(asset);
			tsAssets.js.push('public/assets/js/' + asset.name.replace('.js', '.ts.js'));
		<% } %>
		promises.push(new Promise(function(resolve) {
			gulp<% if (options.js === 'TypeScript') { %>.src(tsAssets.js)<% } else { %>.src(asset.src)<% } %>
				.pipe(plumber())
				.pipe(jshint())
				.pipe(jshint.reporter('jshint-stylish'))
				.pipe(concat(asset.name))
				.pipe(gulp.dest('public/assets/js'))
				.on('end', function () {
					resolve();
				})
				.pipe(browserSync.reload({stream: true}));
		}));
	});

	return Promise.all(promises);
});

gulp.task('minify-css', ['compile-css'], function () {
	var assets = getSourceFiles('.css');

	assets.forEach(function (asset) {
		gulp
			.src('public/assets/css/' + asset.name)
			.pipe(minify())
			.pipe(rename(asset.name.replace('.css', '.min.css')))
			.pipe(gulp.dest('public/assets/css/'));
	});

	return gulp;
});

gulp.task('minify-js', ['compile-js'], function () {
	var assets = getSourceFiles('.js');

	assets.forEach(function (asset) {
		gulp
			.src('public/assets/js/' + asset.name)
			.pipe(uglify())
			.pipe(rename(asset.name.replace('.js', '.min.js')))
			.pipe(gulp.dest('public/assets/js/'));
	});

	return gulp;
});

gulp.task('minify-img', function () {
	return gulp
		.src('assets/img/**/*')
		.pipe(newer('public/assets/img'))
		.pipe(imagemin({
			optimizationLevel: 7,
			progressive: true,
			multipass: true,
			svgoPlugins: [{collapseGroups: false}, {cleanupIDs: false}, {removeUnknownsAndDefaults: false}, {removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('public/assets/img'));
});

gulp.task('copy-assets',   function () {
	gulp
		.src(['assets/font/**/*'])
		.pipe(newer('public/assets/font'))
		.pipe(gulp.dest('public/assets/font'));

	return gulp;
});

gulp.task('assets', ['copy-assets', 'minify-img', 'minify-css', 'minify-js']);

gulp.task('watch', ['assets'], function () {
	var clearCache = function (e) {
		if ('delete' === e.type) {
			delete cache.caches.scripts[e.path];
			remember.forget('scripts', e.path);
		}
	};

	watch([
		'config.json'
	], function(e) {
		cfg = cfg.reload();
		gulp.start('compile-css');
		gulp.start('compile-js');
	});

	watch([
		'assets/**/*.<%= options.pre %>',
		'components/**/*.<%= options.pre %>'
	], function(e) {
		clearCache(e);
		gulp.start('compile-css');
	});

	watch([
		'assets/**/*.js',
		'components/**/*.js'<% if (options.js === 'TypeScript') { %>,
		'assets/**/*.ts',
		'components/**/*.ts'
		<% } %>
	], function(e) {
		clearCache(e);
		gulp.start('compile-js');
	});

	watch([
		'views/**/*.html',
		'!' + cfg.nitro.view_partials_directory + '/*.html', // exclude partials
		'views/_data/**/*.json',
		'components/**/*.html',
		'components/**/_data/*.json'
	], function(e) {
		browserSync.reload();
	});

	watch([
		'assets/img/**/*'
	], function(e) {
		gulp.start('minify-img');
	});

	watch([
		'assets/font/**/*'
	], function(e) {
		gulp.start('copy-assets');
	});
});

gulp.task('browser-sync', ['serve'], function () {
	var port = process.env.PORT || 8080,
		proxy = process.env.PROXY || 8081;

	browserSync({
		proxy: {
			target: 'localhost:' + port,
			middleware: [compression()]
		},
		port:  proxy
	}, function (err) {
		if (!err) {
			browserSync.notify('Compiling your assets, please wait!');
		}
	});
});

gulp.task('serve', function () {
	var port = process.env.PORT || 8080,
		server = liveServer(
			'server.js',
			{
				env: {
					PORT: port
				}
			}
		);

	server.start();

	watch(['server.js', 'app/core/*.js'], server.start);
});

gulp.task('install', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(install());
});

gulp.task('clean', function() {
	del.bind( null, ['public/assets/*'] );
});

gulp.task('test', ['compile-css', 'compile-js'], function (done) {
	karma.start({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun:  true,
		autoWatch:  false
	}, done);
});

gulp.task('develop', ['watch', 'browser-sync']);
gulp.task('production', ['assets'], function(){
	gulp.start('serve');
});
gulp.task('build', ['clean'], function() {
	gulp.start('assets');
});
