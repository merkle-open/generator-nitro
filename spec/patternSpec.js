'use strict';

/* eslint-env jasmine */
/* eslint-disable max-len */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const patternConfig = require(path.join(__dirname, '../generators/app/templates/config/default/patterns.js'));

describe('nitro:pattern', () => {
	describe('when creating a pattern "Test" (organism)', () => {
		describe('but no modifier and decorator is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../generators/pattern'))
					.inTmpDir((dir) => {
						fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism' })
					.on('end', done);
			});

			it('the modifier files are not created', () => {
				assert.noFile([
					'patterns/organisms/Test/css/modifier',
				]);
			});

			it('the decorator files are not created', () => {
				assert.noFile([
					'patterns/organisms/Test/js/decorator',
				]);
			});

			it('the pattern files are created', () => {
				assert.file([
					'patterns/organisms/Test',
					'patterns/organisms/Test/test.html',
					'patterns/organisms/Test/_data/test.json',
					'patterns/organisms/Test/css/test.less',
					'patterns/organisms/Test/js/test.js',
					'patterns/organisms/Test/spec/testSpec.js',
				]);
			});
		});

		describe('and a modifier "More" is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../generators/pattern'))
					.inTmpDir((dir) => {
						fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism', modifier: 'More' })
					.on('end', done);
			});

			it('the pattern and modifier files are created', () => {
				assert.file([
					'patterns/organisms/Test',
					'patterns/organisms/Test/test.html',
					'patterns/organisms/Test/_data/test.json',
					'patterns/organisms/Test/_data/test-more.json',
					'patterns/organisms/Test/css/test.less',
					'patterns/organisms/Test/css/modifier/test-more.less',
					'patterns/organisms/Test/js/test.js',
					'patterns/organisms/Test/spec/testSpec.js',
				]);
			});

			it('the pattern css class is o-test', () => {
				assert.fileContent([['patterns/organisms/Test/css/test.less', /\.o-test \{/]]);
			});

			it('the modifier css class is o-test--more', () => {
				assert.fileContent([['patterns/organisms/Test/css/modifier/test-more.less', /\.o-test--more \{/]]);
			});
		});

		describe('and a decorator "More" is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../generators/pattern'))
					.inTmpDir((dir) => {
						fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism', decorator: 'More' })
					.on('end', done);
			});

			it('the pattern and decorator files are created', () => {
				assert.file([
					'patterns/organisms/Test',
					'patterns/organisms/Test/test.html',
					'patterns/organisms/Test/_data/test.json',
					'patterns/organisms/Test/_data/test-more.json',
					'patterns/organisms/Test/css/test.less',
					'patterns/organisms/Test/js/test.js',
					'patterns/organisms/Test/js/decorator/test-more.js',
					'patterns/organisms/Test/spec/testSpec.js',
				]);
			});

			it('the pattern js class is T.Module.Test', () => {
				assert.fileContent([['patterns/organisms/Test/js/test.js', /T\.Module\.Test =/]]);
			});

			it('the decorator js class is T.Module.Test.More', () => {
				assert.fileContent([['patterns/organisms/Test/js/decorator/test-more.js', /T\.Module\.Test\.More =/]]);
			});
		});
	});

	describe('when creating a pattern "NavMain" (molecule) with a modifier and decorator "SpecialCase"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'NavMain', type: 'molecule', modifier: 'SpecialCase', decorator: 'SpecialCase' })
				.on('end', done);
		});

		it('the pattern and modifier/decorator files are created', () => {
			assert.file([
				'patterns/molecules/NavMain',
				'patterns/molecules/NavMain/navmain.html',
				'patterns/molecules/NavMain/_data/navmain.json',
				'patterns/molecules/NavMain/_data/navmain-specialcase.json',
				'patterns/molecules/NavMain/css/navmain.less',
				'patterns/molecules/NavMain/css/modifier/navmain-specialcase.less',
				'patterns/molecules/NavMain/js/navmain.js',
				'patterns/molecules/NavMain/js/decorator/navmain-specialcase.js',
				'patterns/molecules/NavMain/spec/navmainSpec.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['patterns/molecules/NavMain/css/navmain.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([['patterns/molecules/NavMain/css/modifier/navmain-specialcase.less', /\.m-nav-main--special-case \{/]]);
		});

		it('the pattern js class is T.Module.NavMain', () => {
			assert.fileContent([['patterns/molecules/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', () => {
			assert.fileContent([['patterns/molecules/NavMain/js/decorator/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a pattern "nav-main" (molecule) with a modifier and decorator "special-case"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'nav-main', type: 'molecule', modifier: 'special-case', decorator: 'special-case' })
				.on('end', done);
		});

		it('the pattern and modifier/decorator files are created', () => {
			assert.file([
				'patterns/molecules/nav-main',
				'patterns/molecules/nav-main/nav-main.html',
				'patterns/molecules/nav-main/_data/nav-main.json',
				'patterns/molecules/nav-main/_data/nav-main-special-case.json',
				'patterns/molecules/nav-main/css/nav-main.less',
				'patterns/molecules/nav-main/css/modifier/nav-main-special-case.less',
				'patterns/molecules/nav-main/js/nav-main.js',
				'patterns/molecules/nav-main/js/decorator/nav-main-special-case.js',
				'patterns/molecules/nav-main/spec/nav-mainSpec.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['patterns/molecules/nav-main/css/nav-main.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([['patterns/molecules/nav-main/css/modifier/nav-main-special-case.less', /\.m-nav-main--special-case \{/]]);
		});

		it('the pattern js class is T.Module.NavMain', () => {
			assert.fileContent([['patterns/molecules/nav-main/js/nav-main.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', () => {
			assert.fileContent([['patterns/molecules/nav-main/js/decorator/nav-main-special-case.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a pattern "Nav Main" (molecule) with a modifier "Light.Blue"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(path.join(__dirname, '../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'Nav Main', type: 'molecule', modifier: 'Light.Blue' })
				.on('end', done);
		});

		it('the pattern and decorator files are created', () => {
			assert.file([
				'patterns/molecules/NavMain',
				'patterns/molecules/NavMain/navmain.html',
				'patterns/molecules/NavMain/_data/navmain.json',
				'patterns/molecules/NavMain/_data/navmain-lightblue.json',
				'patterns/molecules/NavMain/css/navmain.less',
				'patterns/molecules/NavMain/css/modifier/navmain-lightblue.less',
				'patterns/molecules/NavMain/js/navmain.js',
				'patterns/molecules/NavMain/spec/navmainSpec.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['patterns/molecules/NavMain/css/navmain.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--light-blue', () => {
			assert.fileContent([['patterns/molecules/NavMain/css/modifier/navmain-lightblue.less', /\.m-nav-main--light-blue \{/]]);
		});

		it('the pattern js class is T.Module.NavMain', () => {
			assert.fileContent([['patterns/molecules/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});
	});
});

