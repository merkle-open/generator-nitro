var helper = require('../../app/helpers/component');

describe('Component Helper', function () {

	it('returns an error message if module is unknown', function () {
		expect(helper('inexistent')).toMatch('<p class="nitro-msg nitro-msg--error">Component `inexistent` with template file `inexistent.html` not found in folder `inexistent`.</p>');
	});

	it('returns an object containing a string if module was found', function () {
		expect(helper('example').hasOwnProperty('string')).toBe(true);
	});

	it('has a non-emtpy return value', function () {
		expect(helper('example').string.length).toBeGreaterThan(0);
	});

});
