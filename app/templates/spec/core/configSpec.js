'use strict';

const config = require('../../app/core/config');

describe('Nitro Config', () => {
	it('contains a base path', () => {
		expect(config.nitro.base_path).toBeDefined();
	});

	it('contains a view file extension', () => {
		expect(config.nitro.view_file_extension).toBeDefined();
	});

	it('contains a view directory', () => {
		expect(config.nitro.view_directory).toBeDefined();
	});

	it('contains a view partials directory', () => {
		expect(config.nitro.view_partials_directory).toBeDefined();
	});

	it('contains a view data directory', () => {
		expect(config.nitro.view_data_directory).toBeDefined();
	});

	it('contains a view layouts directory', () => {
		expect(config.nitro.view_layouts_directory).toBeDefined();
	});

	it('contains a components map', () => {
		expect(config.nitro.components).toEqual(jasmine.any(Object));
	});

	it('contains an assets map', () => {
		expect(config.assets).toEqual(jasmine.any(Object));
	});
});
