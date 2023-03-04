'use strict';

/* eslint-env jasmine */
/* eslint-disable max-len */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const patternConfig = require(path.join(__dirname, '../../../../generators/app/templates/config/default/patterns.js'));

describe('nitro:pattern', () => {
	describe('when creating a pattern "Test" (organism)', () => {
		describe('but no modifier is given', () => {
			beforeAll(() => {
				return helpers
					.run(path.join(__dirname, '../../../../generators/pattern'))
					.inTmpDir((dir) => {
						fs.copySync(
							path.join(__dirname, '../../../../generators/app/templates/project/blueprints'),
							path.join(dir, 'project/blueprints')
						);
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism' });
			});

			it('the modifier files are not created', () => {
				assert.noFile(['src/patterns/organisms/Test/css/modifier']);
			});

			it('the pattern files are created', () => {
				assert.file([
					'src/patterns/organisms/Test',
					'src/patterns/organisms/Test/test.hbs',
					'src/patterns/organisms/Test/_data/test.json',
					'src/patterns/organisms/Test/css/test.scss',
					'src/patterns/organisms/Test/js/test.js',
				]);
			});
		});

		describe('and a modifier "More" is given', () => {
			beforeAll(() => {
				return helpers
					.run(path.join(__dirname, '../../../../generators/pattern'))
					.inTmpDir((dir) => {
						fs.copySync(
							path.join(__dirname, '../../../../generators/app/templates/project/blueprints'),
							path.join(dir, 'project/blueprints')
						);
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism', modifier: 'More' });
			});

			it('the pattern and modifier files are created', () => {
				assert.file([
					'src/patterns/organisms/Test',
					'src/patterns/organisms/Test/test.hbs',
					'src/patterns/organisms/Test/_data/test.json',
					'src/patterns/organisms/Test/_data/test-more.json',
					'src/patterns/organisms/Test/css/test.scss',
					'src/patterns/organisms/Test/css/modifier/test-more.scss',
					'src/patterns/organisms/Test/js/test.js',
				]);
			});

			it('the pattern css class is o-test', () => {
				assert.fileContent([['src/patterns/organisms/Test/css/test.scss', /\.o-test \{/]]);
			});

			it('the modifier css class is o-test--more', () => {
				assert.fileContent([['src/patterns/organisms/Test/css/modifier/test-more.scss', /\.o-test--more \{/]]);
			});
		});
	});

	describe('when creating a pattern "NavMain" (molecule) with a modifier "SpecialCase"', () => {
		beforeAll(() => {
			return helpers
				.run(path.join(__dirname, '../../../../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(
						path.join(__dirname, '../../../../generators/app/templates/project/blueprints'),
						path.join(dir, 'project/blueprints')
					);
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'NavMain', type: 'molecule', modifier: 'SpecialCase' });
		});

		it('the pattern and modifier files are created', () => {
			assert.file([
				'src/patterns/molecules/NavMain',
				'src/patterns/molecules/NavMain/navmain.hbs',
				'src/patterns/molecules/NavMain/_data/navmain.json',
				'src/patterns/molecules/NavMain/_data/navmain-specialcase.json',
				'src/patterns/molecules/NavMain/css/navmain.scss',
				'src/patterns/molecules/NavMain/css/modifier/navmain-specialcase.scss',
				'src/patterns/molecules/NavMain/js/navmain.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['src/patterns/molecules/NavMain/css/navmain.scss', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([
				[
					'src/patterns/molecules/NavMain/css/modifier/navmain-specialcase.scss',
					/\.m-nav-main--special-case \{/,
				],
			]);
		});

		it('the pattern js class is NavMain', () => {
			assert.fileContent([['src/patterns/molecules/NavMain/js/navmain.js', /export default NavMain/]]);
		});
	});

	describe('when creating a pattern "nav-main" (molecule) with a modifier "special-case"', () => {
		beforeAll(() => {
			return helpers
				.run(path.join(__dirname, '../../../../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(
						path.join(__dirname, '../../../../generators/app/templates/project/blueprints'),
						path.join(dir, 'project/blueprints')
					);
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'nav-main', type: 'molecule', modifier: 'special-case' });
		});

		it('the pattern and modifier files are created', () => {
			assert.file([
				'src/patterns/molecules/nav-main',
				'src/patterns/molecules/nav-main/nav-main.hbs',
				'src/patterns/molecules/nav-main/_data/nav-main.json',
				'src/patterns/molecules/nav-main/_data/nav-main-special-case.json',
				'src/patterns/molecules/nav-main/css/nav-main.scss',
				'src/patterns/molecules/nav-main/css/modifier/nav-main-special-case.scss',
				'src/patterns/molecules/nav-main/js/nav-main.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['src/patterns/molecules/nav-main/css/nav-main.scss', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--special-case', () => {
			assert.fileContent([
				[
					'src/patterns/molecules/nav-main/css/modifier/nav-main-special-case.scss',
					/\.m-nav-main--special-case \{/,
				],
			]);
		});

		it('the pattern js class is NavMain', () => {
			assert.fileContent([['src/patterns/molecules/nav-main/js/nav-main.js', /export default NavMain/]]);
		});
	});

	describe('when creating a pattern "Nav Main" (molecule) with a modifier "Light.Blue"', () => {
		beforeAll(() => {
			return helpers
				.run(path.join(__dirname, '../../../../generators/pattern'))
				.inTmpDir((dir) => {
					fs.copySync(
						path.join(__dirname, '../../../../generators/app/templates/project/blueprints'),
						path.join(dir, 'project/blueprints')
					);
					fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
				})
				.withPrompts({ name: 'Nav Main', type: 'molecule', modifier: 'Light.Blue' });
		});

		it('the pattern and modifier files are created', () => {
			assert.file([
				'src/patterns/molecules/NavMain',
				'src/patterns/molecules/NavMain/navmain.hbs',
				'src/patterns/molecules/NavMain/_data/navmain.json',
				'src/patterns/molecules/NavMain/_data/navmain-lightblue.json',
				'src/patterns/molecules/NavMain/css/navmain.scss',
				'src/patterns/molecules/NavMain/css/modifier/navmain-lightblue.scss',
				'src/patterns/molecules/NavMain/js/navmain.js',
			]);
		});

		it('the pattern css class is m-nav-main', () => {
			assert.fileContent([['src/patterns/molecules/NavMain/css/navmain.scss', /\.m-nav-main \{/]]);
		});

		it('the modifier css class is m-nav-main--light-blue', () => {
			assert.fileContent([
				['src/patterns/molecules/NavMain/css/modifier/navmain-lightblue.scss', /\.m-nav-main--light-blue \{/],
			]);
		});

		it('the pattern js class is NavMain', () => {
			assert.fileContent([['src/patterns/molecules/NavMain/js/navmain.js', /export default NavMain/]]);
		});
	});
});
