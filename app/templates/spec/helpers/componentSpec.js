var helper = require('../../app/helpers/component');

describe('Component Helper', function () {

	it('returns an error message if module is unknown', function () {
		expect(helper('Inexistent')).toMatch('<p class="nitro-msg nitro-msg--error">Component `Inexistent` with template file `inexistent.html` not found in folder `Inexistent`.</p>');
	});

	it('returns an object containing a string if module was found', function () {
		expect(helper('Example').hasOwnProperty('string')).toBe(true);
	});

	it('has a non-emtpy return value', function () {
		expect(helper('Example').string.length).toBeGreaterThan(0);
	});

});
