'use strict';

/* eslint-env jasmine */

const pkg = require('../package.json');

describe('Genearator', () => {

	describe('Generator package configuration', () => {

		it('contains the name `generator-nitro`', () => {
			expect(pkg.name).toEqual('generator-nitro');
		});

		it('includes MIT license', () => {
			expect(pkg.license).toEqual('MIT');
		});

	});

});
