'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('nitro:app', function () {
	beforeEach(function (done) {
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
			'project',
			'views',
			'bower.json',
			'package.json'
		]);
	});

	it('includes namics frontend-defaults', function () {
		assert.file([
			'.editorconfig',
			'.gitignore',
			'.gitattributes',
			'.jshintrc'
		]);
	});

	describe('when using less', function () {
		beforeEach(function (done) {
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
		beforeEach(function (done) {
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

	describe('when using view file extension "html"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({ext: 'html'})
				.on('end', done);
		});

		it('files have the .html file extension', function() {
			assert.file([
				'views/index.html',
				'views/404.html',
				'views/_partials/head.html',
				'views/_partials/foot.html',
				'project/blueprints/component/component.html'
			]);
		});
	});

	describe('when using view file extension "hbs"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({ext: 'hbs'})
				.on('end', done);
		});

		it('files have the .hbs file extension', function() {
			assert.file([
				'views/index.hbs',
				'views/404.hbs',
				'views/_partials/head.hbs',
				'views/_partials/foot.hbs',
				'project/blueprints/component/component.hbs'
			]);
		});
	});

	describe('when using view file extension "mustache"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({'skip-install': true})
				.withPrompts({ext: 'mustache'})
				.on('end', done);
		});

		it('files have the .mustache file extension', function() {
			assert.file([
				'views/index.mustache',
				'views/404.mustache',
				'views/_partials/head.mustache',
				'views/_partials/foot.mustache',
				'project/blueprints/component/component.mustache'
			]);
		});
	});
});

