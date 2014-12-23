var cfg = require('../../app/core/config');

describe('Terrific Config', function() {
    it('contains a base path', function() {
        expect(cfg.micro.base_path).toBeDefined();
    });

    it('contains a component map', function() {
        expect(cfg.micro.components).toBeDefined();
    });

    it('contains a view file extension', function() {
        expect(cfg.micro.view_file_extension).toBeDefined();
    });

    it('contains a view partials directory', function() {
        expect(cfg.micro.view_partials_directory).toBeDefined();
    });

    it('contains a view directory', function() {
        expect(cfg.micro.view_directory).toBeDefined();
    });
});