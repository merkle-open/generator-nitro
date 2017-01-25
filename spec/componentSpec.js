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
		js: 'JavaScript',
	},
};

describe('nitro:component', () => {
	describe('when creating a component "Test" (organism)', () => {
		describe('but no modifier and decorator is given', () => {
			beforeAll((done) => {
				helpers.run(path.join(__dirname, '../generators/component'))
					.inDir(path.join(os.tmpdir(), './temp-test'), (dir) => {
						fs.copySync(path.join(__dirname, '../generators/app/templates/project'), path.join(dir, 'project'));
						fs.writeFileSync(path.join(dir, 'config.json'), ejs.render(fs.readFileSync(path.join(__dirname, '../generators/app/templates/config.json'), 'utf8'), configData));
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
	});
});
