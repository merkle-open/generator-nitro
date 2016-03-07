var cfg = require('../../app/core/config');

describe('Nitro Config', function () {
	it('contains a base path', function () {
		expect(cfg.nitro.base_path).toBeDefined();
	});

	it('contains a view file extension', function () {
		expect(cfg.nitro.view_file_extension).toBeDefined();
	});

	it('contains a view directory', function () {
		expect(cfg.nitro.view_directory).toBeDefined();
	});

	it('contains a view partials directory', function () {
		expect(cfg.nitro.view_partials_directory).toBeDefined();
	});

	it('contains a view data directory', function () {
		expect(cfg.nitro.view_data_directory).toBeDefined();
	});

	it('contains a components map', function () {
		expect(cfg.nitro.components).toEqual(jasmine.any(Object));
	});

	it('contains an assets map', function () {
		expect(cfg.assets).toEqual(jasmine.any(Object));
	});
});
