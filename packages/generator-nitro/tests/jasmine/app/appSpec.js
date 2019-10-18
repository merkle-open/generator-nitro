'use strict';

/* eslint-env jasmine */
/* eslint-disable no-inline-comments */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');

describe('nitro:app', () => {

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

	describe('when using custom name', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ name: 'my Project' })
				.on('end', done);
		});

		it('package.json contains project name', () => {
			assert.fileContent([
				['package.json', '"name": "my-project",'],
			]);
		});
	});

	describe('when using template engine hbs', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ templateEngine: 'hbs' })
				.on('end', done);
		});

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
	});

	describe('when using template engine twig', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ templateEngine: 'twig' })
				.on('end', done);
		});

		it('view files have the .twig file extension', () => {
			assert.file([
				'src/views/index.twig',
				'src/views/404.twig',
				'src/views/_partials/head.twig',
				'src/views/_partials/foot.twig',
				'project/blueprints/pattern/$pattern$.twig',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('config/default.js', /viewFileExtension: 'twig'/);
		});
	});

	describe('when using js compiler typescript', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ jsCompiler: 'ts' })
				.on('end', done);
		});

		it('javascript files have the .ts file extension', () => {
			assert.file([
				'src/proto.ts',
				'src/ui.ts',
				'src/proto/js/prototype.ts',
				'project/blueprints/pattern/js/$pattern$.ts',
				'tsconfig.json',
			]);
			assert.noFile([
				'babel.config.js',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('config/default.js', /jsCompiler: 'ts'/);
		});
	});

	describe('when using js compiler javascript', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../../../generators/app'))
				.inDir(path.join(os.tmpdir(), './temp-test'))
				.withOptions({ 'skip-install': true })
				.withPrompts({ jsCompiler: 'js' })
				.on('end', done);
		});

		it('javascript files have the .js file extension', () => {
			assert.file([
				'src/proto.js',
				'src/ui.js',
				'src/proto/js/prototype.js',
				'project/blueprints/pattern/js/$pattern$.js',
				'babel.config.js',
			]);
			assert.noFile([
				'tsconfig.json',
			]);
		});

		it('config contains the correct view file extension', () => {
			assert.fileContent('config/default.js', /jsCompiler: 'js'/);
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

		it('pattern blueprint contains template file', () => {
			assert.file('project/blueprints/pattern/template/$pattern$.hbs');
		});

		it('webpack config enables hbs loader', () => {
			assert.fileContent('config/webpack/options.js', /hbs: true,/);
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

		it('pattern blueprint does not contain template file', () => {
			assert.noFile('project/blueprints/pattern/template/$pattern$.hbs');
		});

		it('webpack config disables hbs loader', () => {
			assert.fileContent('config/webpack/options.js', /hbs: false,/);
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

		it('more example files are present', () => {
			assert.file([
				'src/patterns/atoms/box/box.hbs',
				'src/patterns/atoms/button/button.hbs',
				'src/patterns/atoms/checkbox/checkbox.hbs',
				'src/shared/base/document/css/document.scss',
				'src/shared/utils/breakpoints/css/breakpoints.scss',
				'src/views/example/patterns.hbs',
			]);
		});

		it('example icons are present', () => {
			assert.file([
				'src/shared/assets/img/icon/favicon.ico',
				'src/shared/assets/img/icon/favicon-16x16.png',
				'src/shared/assets/img/icon/favicon-32x32.png',
				'src/shared/assets/img/icon/apple-touch-icon.png',
			]);
		});

		it('some proto files are present', () => {
			assert.file([
				'src/proto/readme.md',
				'src/proto/css/prototype.scss',
				'src/proto/js/prototype.js',
				'src/proto/utils/develop-helpers/index.js',
				'src/proto/utils/develop-helpers/js/key1Breakpoint.js',
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
				'src/shared/assets/img/icon/favicon-16x16.png',
				'src/shared/assets/img/icon/favicon-32x32.png',
				'src/shared/assets/img/icon/apple-touch-icon.png',
			]);
		});

		it('some proto files are still present', () => {
			assert.file([
				'src/proto/readme.md',
				'src/proto/css/prototype.scss',
				'src/proto/js/prototype.js',
			]);
		});

		it('some proto files are not present', () => {
			assert.noFile([
				'src/proto/utils/develop-helpers/index.js',
				'src/proto/utils/develop-helpers/js/key1Breakpoint.js',
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

		it('config does not contain default exporter properties', () => {
			assert.noFileContent([
				['config/default.js', /exporter:/],
			]);
		});
	});
});
