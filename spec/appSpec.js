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

		it('gulpfile.js requires gulp-less dependency', function () {
			assert.fileContent('gulpfile.js', /gulp-less/);
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

		it('gulpfile.js requires gulp-sass dependency', function () {
			assert.fileContent('gulpfile.js', /gulp-sass/);
		});

		it('config.json loads .scss files', function () {
			assert.fileContent('config.json', /\.scss/);
		});

		it('component blueprint does not contain .less files', function () {
			assert.noFile('project/blueprints/component/css/component.less');
			assert.noFile('project/blueprints/component/css/modifier/component-modifier.less');
		});
	});
});

