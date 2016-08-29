'use strict';

const helper = require('../../app/helpers/component');

describe('Component Helper', () => {

	it('returns an error message if module is unknown', () => {
		expect(helper('inexistent')).toMatch('<p class="nitro-msg nitro-msg--error">Component `inexistent` with template file `inexistent.<%= options.viewExt %>` not found in folder `inexistent`.</p>');
	});

	it('returns an object containing a string if module was found', () => {
		expect(helper('example').hasOwnProperty('string')).toBe(true);
	});

	it('has a non-emtpy return value', () => {
		expect(helper('example').string.length).toBeGreaterThan(0);
	});

});
