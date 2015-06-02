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
	describe('when creating a component "Test" that does not support skins', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
				})
				.withPrompts({name: 'Test', type: 'atom'})
				.on('end', done);
		});

		it('the skin files are not created', function () {
			assert.noFile([
				'components/atoms/Test/css/skins',
				'components/atoms/Test/js/skins'
			]);
		});

		it('the component files are created', function () {
			assert.file([
				'components/atoms/Test',
				'components/atoms/Test/test.html',
				'components/atoms/Test/css/test.less',
				'components/atoms/Test/js/test.js',
				'components/atoms/Test/spec/testSpec.js'
			]);
		});
	});

	describe('when creating a component "Test" that does support skins', function () {
		describe('but no skin is given', function () {
			beforeEach(function (done) {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({name: 'Test', type: 'organism'})
					.on('end', done);
			});

			it('the skin files are not created', function () {
				assert.noFile([
					'components/organisms/Test/css/skins',
					'components/organisms/Test/js/skins'
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

		describe('and a skin "More" is given', function () {
			beforeEach(function (done) {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({name: 'Test', type: 'organism', skin: 'More'})
					.on('end', done);
			});

			it('the component and skin files are created', function () {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/css/skins/test-more.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/js/skins/test-more.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});

			it('the component css class is mod-test', function () {
				assert.fileContent([['components/organisms/Test/css/test.less', /\.o-test \{/]]);
			});

			it('the skin css class is skin-test-more', function () {
				assert.fileContent([['components/organisms/Test/css/skins/test-more.less', /\.skin-test-more \{/]]);
			});

			it('the component js class is T.Module.Test', function () {
				assert.fileContent([['components/organisms/Test/js/test.js', /T\.Module\.Test =/]]);
			});

			it('the skin js class is T.Module.Test.More', function () {
				assert.fileContent([['components/organisms/Test/js/skins/test-more.js', /T\.Module\.Test\.More =/]]);
			});
		});
	});

	describe('when creating a component "NavMain" with a skin "SpecialCase"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
				})
				.withPrompts({name: 'NavMain', type: 'organism', skin: 'SpecialCase'})
				.on('end', done);
		});

		it('the component and skin files are created', function () {
			assert.file([
				'components/organisms/NavMain',
				'components/organisms/NavMain/navmain.html',
				'components/organisms/NavMain/css/navmain.less',
				'components/organisms/NavMain/css/skins/navmain-specialcase.less',
				'components/organisms/NavMain/js/navmain.js',
				'components/organisms/NavMain/js/skins/navmain-specialcase.js',
				'components/organisms/NavMain/spec/navmainSpec.js'
			]);
		});

		it('the component css class is mod-nav-main', function () {
			assert.fileContent([['components/organisms/NavMain/css/navmain.less', /\.o-nav-main \{/]]);
		});

		it('the skin css class is skin-nav-main-special-case', function () {
			assert.fileContent([['components/organisms/NavMain/css/skins/navmain-specialcase.less', /\.skin-nav-main-special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', function () {
			assert.fileContent([['components/organisms/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the skin js class is T.Module.NavMain.SpecialCase', function () {
			assert.fileContent([['components/organisms/NavMain/js/skins/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a component "nav-main" with a skin "special-case"', function () {
		beforeEach(function (done) {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
				})
				.withPrompts({name: 'nav-main', type: 'organism', skin: 'special-case'})
				.on('end', done);
		});

		it('the component and skin files are created', function () {
			assert.file([
				'components/organisms/nav-main',
				'components/organisms/nav-main/navmain.html',
				'components/organisms/nav-main/css/navmain.less',
				'components/organisms/nav-main/css/skins/navmain-specialcase.less',
				'components/organisms/nav-main/js/navmain.js',
				'components/organisms/nav-main/js/skins/navmain-specialcase.js',
				'components/organisms/nav-main/spec/navmainSpec.js'
			]);
		});

		it('the component css class is mod-nav-main', function () {
			assert.fileContent([['components/organisms/nav-main/css/navmain.less', /\.o-nav-main \{/]]);
		});

		it('the skin css class is skin-nav-main-special-case', function () {
			assert.fileContent([['components/organisms/nav-main/css/skins/navmain-specialcase.less', /\.skin-nav-main-special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', function () {
			assert.fileContent([['components/organisms/nav-main/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the skin js class is T.Module.NavMain.SpecialCase', function () {
			assert.fileContent([['components/organisms/nav-main/js/skins/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});
});

