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
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test')) // Clear the directory and set it as the CWD
				.withOptions({ 'skip-install': true })  // Mock options passed in
				.on('end', done);
		});

		it('creates blueprint files', () => {
			assert.file([
				'app',
				'assets',
				'config',
				'gulp',
				'patterns',
				'project',
				'public',
				'views',
				'.node-version',
				'package.json',
				'README.md',
				'server.js',
			]);
		});

		it('includes namics frontend-defaults', () => {
			assert.file([
				'.editorconfig',
				'.eslintignore',
				'.eslintrc.js',
				'.gitattributes',
				'.gitignore',
				'.stylelintignore',
				'.stylelintrc',
			]);
		});
	});

	describe('when using less', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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

		it('config loads .less files', () => {
			assert.fileContent('config/default/assets.js', /\.less/);
		});

		it('pattern blueprint does not contain .scss files', () => {
			assert.noFile('project/blueprints/pattern/css/pattern.scss');
			assert.noFile('project/blueprints/pattern/css/modifier/pattern-modifier.scss');
		});
	});

	describe('when using scss', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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

		it('config loads .scss files', () => {
			assert.fileContent('config/default/assets.js', /\.scss/);
		});

		it('pattern blueprint does not contain .less files', () => {
			assert.noFile('project/blueprints/pattern/css/pattern.less');
			assert.noFile('project/blueprints/pattern/css/modifier/pattern-modifier.less');
		});
	});

	describe('when using view file extension html', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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
				'patterns/molecules/example/example.html',
				'project/blueprints/pattern/pattern.html',
			]);
		});

		it('config contain the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'html'/);
		});
	});

	describe('when using view file extension hbs', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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
				'patterns/molecules/example/example.hbs',
				'project/blueprints/pattern/pattern.hbs',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'hbs'/);
		});
	});

	describe('when using view file extension mustache', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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
				'patterns/molecules/example/example.mustache',
				'project/blueprints/pattern/pattern.mustache',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'mustache'/);
		});
	});

	describe('when including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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
			]);
		});

		it('pattern blueprint contains template file', () => {
			assert.file('project/blueprints/pattern/template/pattern.hbs');
		});

		it('example pattern contains template files', () => {
			assert.file([
				'patterns/molecules/example/template/example.hbs',
				'patterns/molecules/example/template/example.links.hbs',
				'patterns/molecules/example/template/partial/example.link.hbs',
				'patterns/molecules/example/_data/example-template.json',
				'patterns/molecules/example/js/decorator/example-template.js',
			]);
		});

		it('config loads template files', () => {
			assert.fileContent([
				['config/default/assets.js', 'patterns/**/template/*.js'],
				['config/default/assets.js', 'patterns/**/template/partial/*.js'],
			]);
		});

		it('gulpfile has compile-templates task', () => {
			assert.fileContent('gulpfile.js', /compile-templates/);
		});

		it('gulp task watch-assets handles template files correct', () => {
			assert.fileContent([
				['gulp/watch-assets.js', 'patterns/**/template/**/*.hbs'],
				['gulp/watch-assets.js', '!patterns/**/template/**/*.hbs'],
			]);
		});
	});

	describe('when not including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
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
			]);
		});

		it('pattern blueprint does not contain template file', () => {
			assert.noFile('project/blueprints/pattern/template/pattern.hbs');
		});

		it('example pattern does not contain template files', () => {
			assert.noFile([
				'patterns/molecules/example/template/example.hbs',
				'patterns/molecules/example/template/example.links.hbs',
				'patterns/molecules/example/template/partial/example.link.hbs',
				'patterns/molecules/example/_data/example-template.json',
				'patterns/molecules/example/js/decorator/example-template.js',
			]);
		});

		it('config does not load template files', () => {
			assert.noFileContent([
				['config/default/assets.js', 'patterns/**/template/*.js'],
				['config/default/assets.js', 'patterns/**/template/partial/*.js'],
			]);
		});

		it('gulpfile does not have compile-templates task', () => {
			assert.noFileContent('gulpfile.js', /compile-templates/);
		});

		it('gulp task watch-assets does not handle template files', () => {
			assert.noFileContent([
				['gulp/watch-assets.js', 'patterns/**/template/**/*.hbs'],
				['gulp/watch-assets.js', '!patterns/**/template/**/*.hbs'],
			]);
		});

	});

	describe('when including example files', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exampleCode: true })
				.on('end', done);
		});

		it('example reset.css is present', () => {
			assert.file([
				'assets/css/example/reset.css',
			]);
		});

		it('example icons are present', () => {
			assert.file([
				'assets/img/icon/favicon.ico',
				'assets/img/icon/tile-icon.png',
				'assets/img/icon/apple-touch-icon.png',
				'assets/img/icon/apple-touch-icon-precomposed.png',
			]);
		});

		it('example pattern is present', () => {
			assert.file([
				'patterns/molecules/example/readme.md',
				'patterns/molecules/example/schema.json',
				'patterns/molecules/example/js/example.js',
				'patterns/molecules/example/_data/example.json',
			]);
		});

		it('icon pattern is present', () => {
			assert.file([
				'patterns/atoms/icon/readme.md',
				'patterns/atoms/icon/schema.json',
				'patterns/atoms/icon/_data/icon.json',
			]);
		});

		it('country project route is present', () => {
			assert.file([
				'project/routes/readme.md',
				'project/routes/countries.js',
				'project/routes/data/countries.json',
				'project/routes/helpers/utils.js',
			]);
		});
	});

	describe('when not including example files', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exampleCode: false })
				.on('end', done);
		});

		it('example reset.css is not present', () => {
			assert.noFile([
				'assets/css/example/reset.css',
			]);
		});

		it('example icons are not present', () => {
			assert.noFile([
				'assets/img/icon/favicon.ico',
				'assets/img/icon/tile-icon.png',
				'assets/img/icon/apple-touch-icon.png',
				'assets/img/icon/apple-touch-icon-precomposed.png',
			]);
		});

		it('example pattern is not present', () => {
			assert.noFile([
				'patterns/molecules/example/readme.md',
				'patterns/molecules/example/schema.json',
				'patterns/molecules/example/js/example.js',
				'patterns/molecules/example/_data/example.json',
			]);
		});

		it('icon pattern is not present', () => {
			assert.noFile([
				'patterns/atoms/icon/readme.md',
				'patterns/atoms/icon/schema.json',
				'patterns/atoms/icon/_data/icon.json',
			]);
		});

		it('country project route is not present', () => {
			assert.noFile([
				'project/routes/countries.js',
				'project/routes/data/countries.json',
				'project/routes/helpers/utils.js',
			]);
		});

		it('but project route readme.md is present', () => {
			assert.file([
				'project/routes/readme.md',
			]);
		});
	});

	describe('when including static exporter', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exporter: true })
				.on('end', done);
		});

		it('package.json contains exporter dependency', () => {
			assert.fileContent([
				['package.json', /nitro-exporter/],
			]);
		});

		it('config contains default exporter properties', () => {
			assert.fileContent([
				['config/default.js', /exporter:/],
			]);
		});
	});

	describe('when not including static exporter', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exporter: false })
				.on('end', done);
		});

		it('package.json does not contain exporter dependency', () => {
			assert.noFileContent([
				['package.json', /nitro-exporter/],
			]);
		});

		it('config does not contain default exporter properties', () => {
			assert.noFileContent([
				['config/default.js', /exporter:/],
			]);
		});
	});

	describe('when including release package', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ release: true })
				.on('end', done);
		});

		it('package.json contains exporter dependency', () => {
			assert.fileContent([
				['package.json', /nitro-release/],
			]);
		});

		it('config does not contain default exporter properties', () => {
			assert.fileContent([
				['config/default.js', /release:/],
			]);
		});
	});

	describe('when not including release package', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ release: false })
				.on('end', done);
		});

		it('package.json does not contain exporter dependency', () => {
			assert.noFileContent([
				['package.json', /nitro-release/],
			]);
		});

		it('config does not contain default exporter properties', () => {
			assert.noFileContent([
				['config/default.js', /release:/],
			]);
		});
	});
});
