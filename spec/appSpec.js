'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('nitro:app', function () {

	describe('when using default options', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test')) // Clear the directory and set it as the CWD
				.withOptions({'skip-install': true})  // Mock options passed in
				.on('end', done);
		});

		it('creates blueprint files', function () {
			assert.file([
				'app',
				'assets',
				'components',
				'gulp',
				'project',
				'public',
				'views',
				'bower.json',
				'package.json'
			]);
		});

		it('includes namics frontend-defaults', function () {
			assert.file([
				'.editorconfig',
				'.gitattributes',
				'.gitignore',
				'.jshintrc'
			]);
		});
	});

	describe('when using less', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({pre: 'less'})
				.on('end', done);
		});

		it('package.json contains gulp-less dependency', function () {
			assert.fileContent('package.json', /gulp-less/);
		});

		it('compile-css uses gulp-less dependency', function () {
			assert.fileContent('gulp/compile-css.js', /plugins.less/);
		});

		it('config.json loads .less files', function () {
			assert.fileContent('config.json', /\.less/);
		});

		it('component blueprint does not contain .scss files', function () {
			assert.noFile('project/blueprints/component/css/component.scss');
			assert.noFile('project/blueprints/component/css/modifier/component-modifier.scss');
		});
	});

	describe('when using scss', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({pre: 'scss'})
				.on('end', done);
		});

		it('package.json contains gulp-sass dependency', function () {
			assert.fileContent('package.json', /gulp-sass/);
		});

		it('compile-css uses gulp-sass dependency', function () {
			assert.fileContent('gulp/compile-css.js', /plugins.sass/);
		});

		it('config.json loads .scss files', function () {
			assert.fileContent('config.json', /\.scss/);
		});

		it('component blueprint does not contain .less files', function () {
			assert.noFile('project/blueprints/component/css/component.less');
			assert.noFile('project/blueprints/component/css/modifier/component-modifier.less');
		});
	});

	describe('when using view file extension html', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({viewExt: 'html'})
				.on('end', done);
		});

		it('view files have the .html file extension', function() {
			assert.file([
				'views/index.html',
				'views/404.html',
				'views/_partials/head.html',
				'views/_partials/foot.html',
				'components/molecules/Example/example.html',
				'project/blueprints/component/component.html'
			]);
		});

		it('config.js defaults contain the correct view file extension', function () {
			assert.fileContent('app/core/config.js', /view_file_extension: 'html'/);
		});
	});

	describe('when using view file extension hbs', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({viewExt: 'hbs'})
				.on('end', done);
		});

		it('view files have the .hbs file extension', function() {
			assert.file([
				'views/index.hbs',
				'views/404.hbs',
				'views/_partials/head.hbs',
				'views/_partials/foot.hbs',
				'components/molecules/Example/example.hbs',
				'project/blueprints/component/component.hbs'
			]);
		});

		it('config.js defaults contain the correct view file extension', function () {
			assert.fileContent('app/core/config.js', /view_file_extension: 'hbs'/);
		});
	});

	describe('when using view file extension mustache', function () {
		beforeAll(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({viewExt: 'mustache'})
				.on('end', done);
		});

		it('view files have the .mustache file extension', function() {
			assert.file([
				'views/index.mustache',
				'views/404.mustache',
				'views/_partials/head.mustache',
				'views/_partials/foot.mustache',
				'components/molecules/Example/example.mustache',
				'project/blueprints/component/component.mustache'
			]);
		});

		it('config.js defaults contain the correct view file extension', function () {
			assert.fileContent('app/core/config.js', /view_file_extension: 'mustache'/);
		});
	});

});
