'use strict';

var pkg = require('../package.json');

describe('Genearator', function () {

	describe('Generator package configuration', function () {

		it('contains the name `generator-nitro`', function () {
			expect(pkg.name).toEqual('generator-nitro');
		});

		it('includes MIT license', function () {
			expect(pkg.license).toEqual('MIT');
		});

	});

});

