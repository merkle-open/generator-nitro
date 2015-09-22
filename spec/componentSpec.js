'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs-extra');
var ejs = require('ejs');

var configData = {
	options: {
		pre: 'less',
		js: 'JavaScript'
	}
};

describe('nitro:component', function () {
	describe('when creating a component "Test"', function () {
		describe('but no modifier and decorator is given', function () {
			beforeEach(function (done) {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({name: 'Test', type: 'organism'})
					.on('end', done);
			});

			it('the modifier files are not created', function () {
				assert.noFile([
					'components/organisms/Test/css/modifier'
				]);
			});

			it('the decorator files are not created', function () {
				assert.noFile([
					'components/organisms/Test/js/decorator'
				]);
			});

			it('the component files are created', function () {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});
		});

		describe('and a modifier "More" is given', function () {
			beforeEach(function (done) {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({name: 'Test', type: 'organism', modifier: 'More'})
					.on('end', done);
			});

			it('the component and modifier files are created', function () {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/css/modifier/test-more.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});

			it('the component css class is o-test', function () {
				assert.fileContent([['components/organisms/Test/css/test.less', /\.o-test \{/]]);
			});

			it('the modifier css class is o-test--more', function () {
				assert.fileContent([['components/organisms/Test/css/modifier/test-more.less', /\.o-test--more \{/]]);
			});
		});

		describe('and a decorator "More" is given', function () {
			beforeEach(function (done) {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({name: 'Test', type: 'organism', decorator: 'More'})
					.on('end', done);
			});

			it('the component and decorator files are created', function () {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/js/decorator/test-more.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});

			it('the component js class is T.Module.Test', function () {
				assert.fileContent([['components/organisms/Test/js/test.js', /T\.Module\.Test =/]]);
			});

			it('the decorator js class is T.Module.Test.More', function () {
				assert.fileContent([['components/organisms/Test/js/decorator/test-more.js', /T\.Module\.Test\.More =/]]);
			});
		});
	});

	describe('when creating a component "NavMain" with a modifier and decorator "SpecialCase"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
				})
				.withPrompts({name: 'NavMain', type: 'organism', modifier: 'SpecialCase', decorator: 'SpecialCase'})
				.on('end', done);
		});

		it('the component and modifier/decorator files are created', function () {
			assert.file([
				'components/organisms/NavMain',
				'components/organisms/NavMain/navmain.html',
				'components/organisms/NavMain/css/navmain.less',
				'components/organisms/NavMain/css/modifier/navmain-specialcase.less',
				'components/organisms/NavMain/js/navmain.js',
				'components/organisms/NavMain/js/decorator/navmain-specialcase.js',
				'components/organisms/NavMain/spec/navmainSpec.js'
			]);
		});

		it('the component css class is o-nav-main', function () {
			assert.fileContent([['components/organisms/NavMain/css/navmain.less', /\.o-nav-main \{/]]);
		});

		it('the modifier css class is o-nav-main--special-case', function () {
			assert.fileContent([['components/organisms/NavMain/css/modifier/navmain-specialcase.less', /\.o-nav-main--special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', function () {
			assert.fileContent([['components/organisms/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', function () {
			assert.fileContent([['components/organisms/NavMain/js/decorator/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a component "nav-main" with a modifier and decorator "special-case"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
				})
				.withPrompts({name: 'nav-main', type: 'organism', modifier: 'special-case', decorator: 'special-case'})
				.on('end', done);
		});

		it('the component and modifier/decorator files are created', function () {
			assert.file([
				'components/organisms/nav-main',
				'components/organisms/nav-main/navmain.html',
				'components/organisms/nav-main/css/navmain.less',
				'components/organisms/nav-main/css/modifier/navmain-specialcase.less',
				'components/organisms/nav-main/js/navmain.js',
				'components/organisms/nav-main/js/decorator/navmain-specialcase.js',
				'components/organisms/nav-main/spec/navmainSpec.js'
			]);
		});

		it('the component css class is o-nav-main', function () {
			assert.fileContent([['components/organisms/nav-main/css/navmain.less', /\.o-nav-main \{/]]);
		});

		it('the modifier css class is o-nav-main--special-case', function () {
			assert.fileContent([['components/organisms/nav-main/css/modifier/navmain-specialcase.less', /\.o-nav-main--special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', function () {
			assert.fileContent([['components/organisms/nav-main/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', function () {
			assert.fileContent([['components/organisms/nav-main/js/decorator/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});
});

