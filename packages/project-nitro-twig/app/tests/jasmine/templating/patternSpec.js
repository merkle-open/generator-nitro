'use strict';

const config = require('config');

if (config.get('nitro.templateEngine') === 'twig') {
	const Twig = require('../../../templating/twig/engine');
	describe('Twig Pattern Helper', () => {

		it('returns an error message if module is unknown', () => {
			const template = Twig.twig({ data: '{% pattern name=\'inexistent\' data=\'inexistent\' %}' });
			expect(template.render({})).toMatch('<p class="nitro-msg nitro-msg--error">Pattern `inexistent` with template file `inexistent.twig` not found in folder `inexistent`.</p>');
		});

		it('returns a string containing the rendered markup if module was found', () => {
			const template = Twig.twig({ data: '{% pattern name=\'example\' data=\'example\' %}' });
			const markup = template.render({});
			expect(typeof markup).toBe('string');
		});

		it('returns a string being not empty', () => {
			const template = Twig.twig({ data: '{% pattern name=\'example\' data=\'example\' %}' });
			const markup = template.render({});
			expect(markup.length).toBeGreaterThan(0);
		});

	});
} else {
	const helper = require('../../../templating/hbs/helpers/pattern');
	describe('Hbs Pattern Helper', () => {

		it('returns an error message if module is unknown', () => {
			expect(helper('inexistent')).toMatch(`<p class="nitro-msg nitro-msg--error">Pattern \`inexistent\` with template file \`inexistent.${config.get('nitro.viewFileExtension')}\` not found in folder \`inexistent\`.</p>`);
		});

		it('returns an object containing a string if module was found', () => {
			expect(helper('example').hasOwnProperty('string')).toBe(true);
		});

		it('has a non-emtpy return value', () => {
			expect(helper('example').string.length).toBeGreaterThan(0);
		});

	});
}
