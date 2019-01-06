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
				'config',
				'project',
				'public',
				'.node-version',
				'gulpfile.js',
				'package.json',
				'readme.md',
				'src/patterns',
				'src/proto',
				'src/shared',
				'src/views',
				'src/proto.js',
				'src/ui.js',
			]);
		});

		it('includes project config files', () => {
			assert.file([
				'.eslintignore',
				'.eslintrc.js',
				'.prettierignore',
				'.prettierrc.js',
				'.stylelintignore',
				'stylelint.config.js',
			]);
		});

		it('includes namics frontend-defaults', () => {
			assert.file([
				'.editorconfig',
				'.gitattributes',
				'.gitignore',
			]);
		});

		it('package.json contains project name', () => {
			assert.fileContent([
				['package.json', '"name": "temp-test",'],
			]);
		});

		it('package.json contains @nitro dependencies', () => {
			assert.fileContent([
				['package.json', '@nitro/app'],
				['package.json', '@nitro/exporter'],
				['package.json', '@nitro/gulp'],
				['package.json', '@nitro/webpack'],
			]);
		});

		// viewFileExtension (hbs)
		it('view files have the .hbs file extension', () => {
			assert.file([
				'src/views/index.hbs',
				'src/views/404.hbs',
				'src/views/_partials/head.hbs',
				'src/views/_partials/foot.hbs',
				'project/blueprints/pattern/$pattern$.hbs',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('config/default.js', /viewFileExtension: 'hbs'/);
		});

		// clientTemplates (false)
		it('pattern blueprint does not contain template file', () => {
			assert.noFile('project/blueprints/pattern/template/$pattern$.hbs');
		});

		it('webpack config disables hbs loader', () => {
			assert.fileContent('config/webpack/options.js', /hbs: false,/);
		});

		// exampleCode (false)
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

		it('more example files are not present', () => {
			assert.noFile([
				'src/patterns/atoms/box/box.hbs',
				'src/patterns/atoms/button/button.hbs',
				'src/patterns/atoms/checkbox/checkbox.hbs',
				'src/shared/base/document/css/document.scss',
				'src/shared/utils/breakpoints/css/breakpoints.scss',
				'src/views/example/patterns.hbs',
			]);
		});

		it('example icons are not present', () => {
			assert.noFile([
				'src/shared/assets/img/icon/favicon.ico',
				'src/shared/assets/img/icon/tile-icon.png',
				'src/shared/assets/img/icon/apple-touch-icon.png',
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

		// not including exporter
		it('config does not contain default exporter properties', () => {
			assert.noFileContent([
				['config/default.js', /exporter:/],
			]);
		});

	});
});
