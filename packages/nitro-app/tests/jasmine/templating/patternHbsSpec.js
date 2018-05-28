'use strict';

const config = require('config');
const helper = require('../../../app/templating/hbs/helpers/pattern');

describe('Hbs Pattern Helper', () => {

	it('returns an error message if module is unknown', () => {
		expect(helper('nonexistent')).toMatch(`<p class="nitro-msg nitro-msg--error">Pattern \`nonexistent\` with template file \`nonexistent.${config.get('nitro.viewFileExtension')}\` not found in folder \`nonexistent\`.</p>`);
	});

	it('returns an object containing a string if module was found', () => {
		// eslint-disable-next-line
		expect(helper('example').hasOwnProperty('string')).toBe(true);
	});

	it('has a non-empty return value', () => {
		expect(helper('example').string.length).toBeGreaterThan(0);
	});

});
