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
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test')) // Clear the directory and set it as the CWD
				.withOptions({ 'skip-install': true, 'skip-questions': true }) // Mock options passed in
				.on('end', done);
		});

		// base files
		it('creates blueprint files', () => {
			assert.file([
				'app',
				'config',
				'gulp',
				'project',
				'public',
				'.node-version',
				'package.json',
				'readme.md',
				'server.js',
				'src/assets',
				'src/patterns',
				'src/views',
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

		// scss
		it('package.json contains gulp-sass dependency', () => {
			assert.fileContent('package.json', /gulp-sass/);
		});

		it('compile-css uses gulp-sass dependency', () => {
			assert.fileContent('gulp/compile-css.js', /plugins.sass/);
		});

		it('pattern blueprint does not contain .less files', () => {
			assert.noFile('project/blueprints/pattern/css/pattern.less');
			assert.noFile('project/blueprints/pattern/css/modifier/pattern-modifier.less');
		});

		// hbs
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

		// not including client templates
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

		// not including example files
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

		// not including exporter
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

		// not including release
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
