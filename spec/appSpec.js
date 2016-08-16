'use strict';

/* eslint-env jasmine */
/* eslint-disable no-inline-comments */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');

describe('nitro:app', () => {

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

	describe('when using default options', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test')) // Clear the directory and set it as the CWD
				.withOptions({ 'skip-install': true })  // Mock options passed in
				.on('end', done);
		});

		it('creates blueprint files', () => {
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

		it('includes namics frontend-defaults', () => {
			assert.file([
				'.editorconfig',
				'.gitattributes',
				'.gitignore',
				'.jshintrc',
				'.jshintignore',
				'.stylelintrc',
				'.stylelintignore'
			]);
		});
	});

	describe('when using less', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ pre: 'less' })
				.on('end', done);
		});

		it('package.json contains gulp-less dependency', () => {
			assert.fileContent('package.json', /gulp-less/);
		});

		it('compile-css uses gulp-less dependency', () => {
			assert.fileContent('gulp/compile-css.js', /plugins.less/);
		});

		it('config.json loads .less files', () => {
			assert.fileContent('config.json', /\.less/);
		});

		it('component blueprint does not contain .scss files', () => {
			assert.noFile('project/blueprints/component/css/component.scss');
			assert.noFile('project/blueprints/component/css/modifier/component-modifier.scss');
		});
	});

	describe('when using scss', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ pre: 'scss' })
				.on('end', done);
		});

		it('package.json contains gulp-sass dependency', () => {
			assert.fileContent('package.json', /gulp-sass/);
		});

		it('compile-css uses gulp-sass dependency', () => {
			assert.fileContent('gulp/compile-css.js', /plugins.sass/);
		});

		it('config.json loads .scss files', () => {
			assert.fileContent('config.json', /\.scss/);
		});

		it('component blueprint does not contain .less files', () => {
			assert.noFile('project/blueprints/component/css/component.less');
			assert.noFile('project/blueprints/component/css/modifier/component-modifier.less');
		});
	});

	describe('when using view file extension html', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'html' })
				.on('end', done);
		});

		it('view files have the .html file extension', () => {
			assert.file([
				'views/index.html',
				'views/404.html',
				'views/_partials/head.html',
				'views/_partials/foot.html',
				'components/molecules/example/example.html',
				'project/blueprints/component/component.html'
			]);
		});

		it('config.js defaults contain the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /view_file_extension: 'html'/);
		});
	});

	describe('when using view file extension hbs', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'hbs' })
				.on('end', done);
		});

		it('view files have the .hbs file extension', () => {
			assert.file([
				'views/index.hbs',
				'views/404.hbs',
				'views/_partials/head.hbs',
				'views/_partials/foot.hbs',
				'components/molecules/example/example.hbs',
				'project/blueprints/component/component.hbs'
			]);
		});

		it('config.js defaults contain the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /view_file_extension: 'hbs'/);
		});
	});

	describe('when using view file extension mustache', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'mustache' })
				.on('end', done);
		});

		it('view files have the .mustache file extension', () => {
			assert.file([
				'views/index.mustache',
				'views/404.mustache',
				'views/_partials/head.mustache',
				'views/_partials/foot.mustache',
				'components/molecules/example/example.mustache',
				'project/blueprints/component/component.mustache'
			]);
		});

		it('config.js defaults contain the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /view_file_extension: 'mustache'/);
		});
	});

	describe('when including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ clientTpl: true })
				.on('end', done);
		});

		it('package.json contains some specific dependencies', () => {
			assert.fileContent([
				['package.json', /gulp-change/],
				['package.json', /gulp-declare/],
				['package.json', /gulp-handlebars/],
				['package.json', /gulp-wrap/],
				['package.json', /merge-stream/]
			]);
		});

		it('component blueprint contains template file', () => {
			assert.file('project/blueprints/component/template/component.hbs');
		});

		it('example component contains template files', () => {
			assert.file([
				'components/molecules/example/template/example.hbs',
				'components/molecules/example/template/example.links.hbs',
				'components/molecules/example/template/partial/example.link.hbs',
				'components/molecules/example/_data/example-template.json',
				'components/molecules/example/js/decorator/example-template.js'
			]);
		});

		it('config.json loads template files', () => {
			assert.fileContent([
				['config.json', 'components/**/template/*.js'],
				['config.json', 'components/**/template/partial/*.js']
			]);
		});

		it('gulpfile has compile-templates task', () => {
			assert.fileContent('gulpfile.js', /compile-templates/);
		});

		it('gulp task watch-assets handles template files correct', () => {
			assert.fileContent([
				['gulp/watch-assets.js', 'components/**/template/**/*.hbs'],
				['gulp/watch-assets.js', '!components/**/template/**/*.hbs']
			]);
		});

	});

	describe('when not including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ clientTpl: false })
				.on('end', done);
		});

		it('package.json does not contain some specific dependencies', () => {
			assert.noFileContent([
				['package.json', /gulp-change/],
				['package.json', /gulp-declare/],
				['package.json', /gulp-handlebars/],
				['package.json', /gulp-wrap/],
				['package.json', /merge-stream/]
			]);
		});

		it('component blueprint does not contain template file', () => {
			assert.noFile('project/blueprints/component/template/component.hbs');
		});

		it('example component does not contain template files', () => {
			assert.noFile([
				'components/molecules/example/template/example.hbs',
				'components/molecules/example/template/example.links.hbs',
				'components/molecules/example/template/partial/example.link.hbs',
				'components/molecules/example/_data/example-template.json',
				'components/molecules/example/js/decorator/example-template.js'
			]);
		});

		it('config.json does not load template files', () => {
			assert.noFileContent([
				['config.json', 'components/**/template/*.js'],
				['config.json', 'components/**/template/partial/*.js']
			]);
		});

		it('gulpfile does not have compile-templates task', () => {
			assert.noFileContent('gulpfile.js', /compile-templates/);
		});

		it('gulp task watch-assets does not handle template files', () => {
			assert.noFileContent([
				['gulp/watch-assets.js', 'components/**/template/**/*.hbs'],
				['gulp/watch-assets.js', '!components/**/template/**/*.hbs']
			]);
		});

	});

	describe('when including static exporter', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exporter: true })
				.on('end', done);
		});

		it('package.json contains exporter dependency', () => {
			assert.fileContent([
				['package.json', /nitro-exporter/]
			]);
		});

		it('config.json contains default exporter properties', () => {
			assert.fileContent([
				['config.json', /"exporter"/]
			]);
		});
	});

	describe('when not including static exporter', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exporter: false })
				.on('end', done);
		});

		it('package.json does not contain exporter dependency', () => {
			assert.noFileContent([
				['package.json', /nitro-exporter/]
			]);
		});

		it('config.json does not contain default exporter properties', () => {
			assert.noFileContent([
				['config.json', /"exporter"/]
			]);
		});
	});

	describe('when including release package', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ release: true })
				.on('end', done);
		});

		it('package.json contains exporter dependency', () => {
			assert.fileContent([
				['package.json', /nitro-release/]
			]);
		});

		it('config.json does not contain default exporter properties', () => {
			assert.fileContent([
				['config.json', /"release"/]
			]);
		});
	});

	describe('when not including release package', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ release: false })
				.on('end', done);
		});

		it('package.json does not contain exporter dependency', () => {
			assert.noFileContent([
				['package.json', /nitro-release/]
			]);
		});

		it('config.json does not contain default exporter properties', () => {
			assert.noFileContent([
				['config.json', /"release"/]
			]);
		});
	});
});
