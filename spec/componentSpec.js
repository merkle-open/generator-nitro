'use strict';

/* eslint-env jasmine */
/* eslint-disable max-len */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');
const fs = require('fs-extra');
const ejs = require('ejs');

const configData = {
	options: {
		pre: 'less',
		js: 'JavaScript'
	}
};

describe('nitro:component', () => {
	describe('when creating a component "Test" (organism)', () => {
		describe('but no modifier and decorator is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({ name: 'Test', type: 'organism' })
					.on('end', done);
			});

			it('the modifier files are not created', () => {
				assert.noFile([
					'components/organisms/Test/css/modifier'
				]);
			});

			it('the decorator files are not created', () => {
				assert.noFile([
					'components/organisms/Test/js/decorator'
				]);
			});

			it('the component files are created', () => {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/_data/test.json',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});
		});

		describe('and a modifier "More" is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({ name: 'Test', type: 'organism', modifier: 'More' })
					.on('end', done);
			});

			it('the component and modifier files are created', () => {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/_data/test.json',
					'components/organisms/Test/_data/test-more.json',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/css/modifier/test-more.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});

			it('the component css class is o-test', () => {
				assert.fileContent([['components/organisms/Test/css/test.less', /\.o-test \{/]]);
			});

			it('the modifier css class is o-test--more', () => {
				assert.fileContent([['components/organisms/Test/css/modifier/test-more.less', /\.o-test--more \{/]]);
			});
		});

		describe('and a decorator "More" is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
						fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
					})
					.withPrompts({ name: 'Test', type: 'organism', decorator: 'More' })
					.on('end', done);
			});

			it('the component and decorator files are created', () => {
				assert.file([
					'components/organisms/Test',
					'components/organisms/Test/test.html',
					'components/organisms/Test/_data/test.json',
					'components/organisms/Test/_data/test-more.json',
					'components/organisms/Test/css/test.less',
					'components/organisms/Test/js/test.js',
					'components/organisms/Test/js/decorator/test-more.js',
					'components/organisms/Test/spec/testSpec.js'
				]);
			});

			it('the component js class is T.Module.Test', () => {
				assert.fileContent([['components/organisms/Test/js/test.js', /T\.Module\.Test =/]]);
			});

			it('the decorator js class is T.Module.Test.More', () => {
				assert.fileContent([['components/organisms/Test/js/decorator/test-more.js', /T\.Module\.Test\.More =/]]);
			});
		});
	});

	describe('when creating a component "NavMain" (molecule) with a modifier and decorator "SpecialCase"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
				})
				.withPrompts({ name: 'NavMain', type: 'molecule', modifier: 'SpecialCase', decorator: 'SpecialCase' })
				.on('end', done);
		});

		it('the component and modifier/decorator files are created', () => {
			assert.file([
				'components/molecules/NavMain',
				'components/molecules/NavMain/navmain.html',
				'components/molecules/NavMain/_data/navmain.json',
				'components/molecules/NavMain/_data/navmain-specialcase.json',
				'components/molecules/NavMain/css/navmain.less',
				'components/molecules/NavMain/css/modifier/navmain-specialcase.less',
				'components/molecules/NavMain/js/navmain.js',
				'components/molecules/NavMain/js/decorator/navmain-specialcase.js',
				'components/molecules/NavMain/spec/navmainSpec.js'
			]);
		});

		it('the component css class is m-nav-main', () => {
			assert.fileContent([['components/molecules/NavMain/css/navmain.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([['components/molecules/NavMain/css/modifier/navmain-specialcase.less', /\.m-nav-main--special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', () => {
			assert.fileContent([['components/molecules/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', () => {
			assert.fileContent([['components/molecules/NavMain/js/decorator/navmain-specialcase.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a component "nav-main" (molecule) with a modifier and decorator "special-case"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
				})
				.withPrompts({ name: 'nav-main', type: 'molecule', modifier: 'special-case', decorator: 'special-case' })
				.on('end', done);
		});

		it('the component and modifier/decorator files are created', () => {
			assert.file([
				'components/molecules/nav-main',
				'components/molecules/nav-main/nav-main.html',
				'components/molecules/nav-main/_data/nav-main.json',
				'components/molecules/nav-main/_data/nav-main-special-case.json',
				'components/molecules/nav-main/css/nav-main.less',
				'components/molecules/nav-main/css/modifier/nav-main-special-case.less',
				'components/molecules/nav-main/js/nav-main.js',
				'components/molecules/nav-main/js/decorator/nav-main-special-case.js',
				'components/molecules/nav-main/spec/nav-mainSpec.js'
			]);
		});

		it('the component css class is m-nav-main', () => {
			assert.fileContent([['components/molecules/nav-main/css/nav-main.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([['components/molecules/nav-main/css/modifier/nav-main-special-case.less', /\.m-nav-main--special-case \{/]]);
		});

		it('the component js class is T.Module.NavMain', () => {
			assert.fileContent([['components/molecules/nav-main/js/nav-main.js', /T\.Module\.NavMain =/]]);
		});

		it('the decorator js class is T.Module.NavMain.SpecialCase', () => {
			assert.fileContent([['components/molecules/nav-main/js/decorator/nav-main-special-case.js', /T\.Module\.NavMain\.SpecialCase =/]]);
		});
	});

	describe('when creating a component "Nav Main" (molecule) with a modifier "Light.Blue"', () => {
		beforeAll((done) => {
			helpers.run(path.join(__dirname, '../component'))
				.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
					fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
					fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData));
				})
				.withPrompts({ name: 'Nav Main', type: 'molecule', modifier: 'Light.Blue' })
				.on('end', done);
		});

		it('the component and decorator files are created', () => {
			assert.file([
				'components/molecules/NavMain',
				'components/molecules/NavMain/navmain.html',
				'components/molecules/NavMain/_data/navmain.json',
				'components/molecules/NavMain/_data/navmain-lightblue.json',
				'components/molecules/NavMain/css/navmain.less',
				'components/molecules/NavMain/css/modifier/navmain-lightblue.less',
				'components/molecules/NavMain/js/navmain.js',
				'components/molecules/NavMain/spec/navmainSpec.js'
			]);
		});

		it('the component css class is m-nav-main', () => {
			assert.fileContent([['components/molecules/NavMain/css/navmain.less', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--light-blue', () => {
			assert.fileContent([['components/molecules/NavMain/css/modifier/navmain-lightblue.less', /\.m-nav-main--light-blue \{/]]);
		});

		it('the component js class is T.Module.NavMain', () => {
			assert.fileContent([['components/molecules/NavMain/js/navmain.js', /T\.Module\.NavMain =/]]);
		});

	});
});
