const assert = require('assert');

const pkg = require('../../../package.json');

describe('Generator package configuration', () => {
	it('contains the name `generator-nitro`', () => {
		assert.strictEqual(pkg.name, 'generator-nitro');
	});

	it('includes MIT license', () => {
		assert.strictEqual(pkg.license, 'MIT');
	});
});
