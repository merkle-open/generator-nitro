'use strict';

const config = require('config');
const hbs = require('hbs');

describe('Hbs Pattern Helper', () => {

	it('returns an error message if module is unknown', () => {
		expect(hbs.handlebars.helpers.pattern('nonexistent')).toMatch(`<p class="nitro-msg nitro-msg--error">Pattern \`nonexistent\` with template file \`nonexistent.${config.get('nitro.viewFileExtension')}\` not found in folder \`nonexistent\`.</p>`);
	});

	it('returns an error message if module with specific type is unknown', () => {
		expect(hbs.handlebars.helpers.pattern('example', { hash: { template: 'example', type: 'organism' } })).toMatch(`<p class="nitro-msg nitro-msg--error">Pattern \`example\` within pattern type \`organism\` with template file \`example.${config.get('nitro.viewFileExtension')}\` not found in folder \`example\`.</p>`);
	});

	it('returns an error message if module type is unknown', () => {
		expect(hbs.handlebars.helpers.pattern('example', { hash: { template: 'example', type: 'nonexistent' } })).toMatch(`<p class="nitro-msg nitro-msg--error">Pattern type \`nonexistent\` not found in pattern config.</p>`);
	});

	it('returns an object containing a string if module was found', () => {
		console.log(typeof hbs.handlebars.helpers.pattern('example'))
		// eslint-disable-next-line
		expect(hbs.handlebars.helpers.pattern('example').hasOwnProperty('string')).toBe(true);
	});

	it('has a non-empty return value', () => {
		expect(hbs.handlebars.helpers.pattern('example').string.length).toBeGreaterThan(0);
	});

	it('returns the first pattern found with the provided name when no type parameter is present', () => {
		// eslint-disable-next-line
		expect(hbs.handlebars.helpers.pattern('example')).toMatch('<div>a</div>');
	});

	it('returns the specific pattern found with the provided name AND type parameter', () => {
		// eslint-disable-next-line
		expect(hbs.handlebars.helpers.pattern('example', { hash: { template: 'example', type: 'molecule' } })).toMatch('<div>m</div>');
	});
});
