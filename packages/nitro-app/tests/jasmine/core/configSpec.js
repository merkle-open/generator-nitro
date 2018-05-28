'use strict';

const config = require('config');

describe('Nitro Config', () => {
	it('contains a base path', () => {
		expect(config.get('nitro.basePath')).toBeDefined();
	});

	it('contains a view file extension', () => {
		expect(config.get('nitro.viewFileExtension')).toBeDefined();
	});

	it('contains a view directory', () => {
		expect(config.get('nitro.viewDirectory')).toBeDefined();
	});

	it('contains a view partials directory', () => {
		expect(config.get('nitro.viewPartialsDirectory')).toBeDefined();
	});

	it('contains a view data directory', () => {
		expect(config.get('nitro.viewDataDirectory')).toBeDefined();
	});

	it('contains a view layouts directory', () => {
		expect(config.get('nitro.viewLayoutsDirectory')).toBeDefined();
	});

	it('contains a tmp directory', () => {
		expect(config.get('nitro.tmpDirectory')).toBeDefined();
	});

	it('contains a templateEngine', () => {
		expect(config.get('nitro.templateEngine')).toBeDefined();
	});

	it('contains a pattern map', () => {
		expect(config.get('nitro.patterns')).toEqual(jasmine.any(Object));
	});

	it('contains an assets map', () => {
		expect(config.get('assets')).toEqual(jasmine.any(Object));
	});
});
