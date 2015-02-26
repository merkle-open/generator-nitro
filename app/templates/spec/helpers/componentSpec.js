var helper = require('../../app/helpers/component');

describe('Component Helper', function() {

    it('throws an error if module name is unknown', function() {
        expect(function() {
            helper('inexistent')
        }).toThrow(new Error('Component inexistent not found. (Hint: have you added it to config.json?)'));
    });

    it('returns an object containing a string if module was found', function() {
        expect(helper('example').hasOwnProperty('string')).toBe(true);
    });

    it('has a non-emtpy return value', function() {
        expect(helper('example').string.length).toBeGreaterThan(0);
    });
});
