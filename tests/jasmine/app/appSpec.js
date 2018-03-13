'use strict';

/* eslint-env jasmine */
/* eslint-disable no-inline-comments */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');

describe('nitro:app', () => {

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

	describe('when using less', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'html' })
				.on('end', done);
		});

		it('view files have the .html file extension', () => {
			assert.file([
				'src/views/index.html',
				'src/views/404.html',
				'src/views/_partials/head.html',
				'src/views/_partials/foot.html',
				'project/blueprints/pattern/pattern.html',
			]);
		});

		it('config contain the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'html'/);
		});
	});

	describe('when using view file extension hbs', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'hbs' })
				.on('end', done);
		});

		it('view files have the .hbs file extension', () => {
			assert.file([
				'src/views/index.hbs',
				'src/views/404.hbs',
				'src/views/_partials/head.hbs',
				'src/views/_partials/foot.hbs',
				'project/blueprints/pattern/pattern.hbs',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'hbs'/);
		});
	});

	describe('when using view file extension mustache', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ viewExt: 'mustache' })
				.on('end', done);
		});

		it('view files have the .mustache file extension', () => {
			assert.file([
				'src/views/index.mustache',
				'src/views/404.mustache',
				'src/views/_partials/head.mustache',
				'src/views/_partials/foot.mustache',
				'project/blueprints/pattern/pattern.mustache',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('app/core/config.js', /viewFileExtension: 'mustache'/);
		});
	});

	describe('when including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
				['gulp/watch-assets.js', 'src/patterns/**/template/**/*.hbs'],
				['gulp/watch-assets.js', '!src/patterns/**/template/**/*.hbs'],
			]);
		});
	});

	describe('when not including client templates', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
				'src/patterns/molecules/example/template/example.hbs',
				'src/patterns/molecules/example/template/example.links.hbs',
				'src/patterns/molecules/example/template/partial/example.link.hbs',
				'src/patterns/molecules/example/_data/example-template.json',
				'src/patterns/molecules/example/js/decorator/example-template.js',
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exampleCode: true })
				.on('end', done);
		});

		it('example reset.css is present', () => {
			assert.file([
				'src/assets/css/example/reset.css',
			]);
		});

		it('example icons are present', () => {
			assert.file([
				'src/assets/img/icon/favicon.ico',
				'src/assets/img/icon/tile-icon.png',
				'src/assets/img/icon/apple-touch-icon.png',
			]);
		});

		it('example pattern is present', () => {
			assert.file([
				'src/patterns/molecules/example/readme.md',
				'src/patterns/molecules/example/schema.json',
				'src/patterns/molecules/example/js/example.js',
				'src/patterns/molecules/example/_data/example.json',
			]);
		});

		it('icon pattern is present', () => {
			assert.file([
				'src/patterns/atoms/icon/readme.md',
				'src/patterns/atoms/icon/schema.json',
				'src/patterns/atoms/icon/_data/icon.json',
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ exampleCode: false })
				.on('end', done);
		});

		it('example reset.css is not present', () => {
			assert.noFile([
				'src/assets/css/example/reset.css',
			]);
		});

		it('example icons are not present', () => {
			assert.noFile([
				'src/assets/img/icon/favicon.ico',
				'src/assets/img/icon/tile-icon.png',
				'src/assets/img/icon/apple-touch-icon.png',
			]);
		});

		it('example pattern is not present', () => {
			assert.noFile([
				'src/patterns/molecules/example/readme.md',
				'src/patterns/molecules/example/schema.json',
				'src/patterns/molecules/example/js/example.js',
				'src/patterns/molecules/example/_data/example.json',
			]);
		});

		it('icon pattern is not present', () => {
			assert.noFile([
				'src/patterns/atoms/icon/readme.md',
				'src/patterns/atoms/icon/schema.json',
				'src/patterns/atoms/icon/_data/icon.json',
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
			helpers.run(path.join(__dirname, '../../../generators/app'))
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
});
