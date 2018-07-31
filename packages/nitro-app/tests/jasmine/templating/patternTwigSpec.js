'use strict';

const Twig = require('../../../app/templating/twig/engine');

describe('Twig Pattern Helper', () => {

	// it('returns an error message if module is unknown', () => {
	// 	const template = Twig.twig({ data: '{% pattern name=\'inexistent\' data=\'inexistent\' %}' });
	// 	expect(template.render({})).toMatch('<p class="nitro-msg nitro-msg--error">Pattern `inexistent` with template file `inexistent.twig` not found in folder `inexistent`.</p>');
	// });

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
