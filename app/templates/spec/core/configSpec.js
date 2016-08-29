'use strict';

const cfg = require('../../app/core/config');

describe('Nitro Config', () => {
	it('contains a base path', () => {
		expect(cfg.nitro.base_path).toBeDefined();
	});

	it('contains a view file extension', () => {
		expect(cfg.nitro.view_file_extension).toBeDefined();
	});

	it('contains a view directory', () => {
		expect(cfg.nitro.view_directory).toBeDefined();
	});

	it('contains a view partials directory', () => {
		expect(cfg.nitro.view_partials_directory).toBeDefined();
	});

	it('contains a view data directory', () => {
		expect(cfg.nitro.view_data_directory).toBeDefined();
	});

	it('contains a view layouts directory', () => {
		expect(cfg.nitro.view_layouts_directory).toBeDefined();
	});

	it('contains a components map', () => {
		expect(cfg.nitro.components).toEqual(jasmine.any(Object));
	});

	it('contains an assets map', () => {
		expect(cfg.assets).toEqual(jasmine.any(Object));
	});
});
