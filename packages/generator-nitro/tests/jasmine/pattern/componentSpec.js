'use strict';

/* eslint-env jasmine */
/* eslint-disable max-len */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const patternConfig = require(path.join(__dirname, '../../../generators/app/templates/config/default/patterns.js'));

describe('nitro:component', () => {
	describe('when creating a component "Test" (organism)', () => {
		describe('but no modifier and decorator is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../../../generators/component'))
					.inTmpDir((dir) => {
						fs.copySync(path.join(__dirname, '../../../generators/app/templates/project/blueprints'), path.join(dir, 'project/blueprints'));
						fs.writeJsonSync(path.join(dir, 'config.json'), { nitro: { patterns: patternConfig } });
					})
					.withPrompts({ name: 'Test', type: 'organism' })
					.on('end', done);
			});

			it('the modifier files are not created', () => {
				assert.noFile([
					'src/patterns/organisms/Test/css/modifier',
				]);
			});

			it('the decorator files are not created', () => {
				assert.noFile([
					'src/patterns/organisms/Test/js/decorator',
				]);
			});

			it('the pattern files are created', () => {
				assert.file([
					'src/patterns/organisms/Test',
					'src/patterns/organisms/Test/test.hbs',
					'src/patterns/organisms/Test/_data/test.json',
					'src/patterns/organisms/Test/css/test.less',
					'src/patterns/organisms/Test/js/test.js',
					'src/patterns/organisms/Test/test/test.test.js',
				]);
			});
		});
	});
});
