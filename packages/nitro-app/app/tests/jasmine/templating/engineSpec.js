'use strict';

const config = require('config');

if (config.get('nitro.templateEngine') === 'twig') {
	const Twig = require('../../../templating/twig/engine');
	describe('Nitro\'s Twig helper loader', () => {
		it('has registered the pattern helper', () => {
			const template = Twig.twig({ data: '{% pattern name=\'inexistent\' data=\'inexistent\' %}' });

			// since we cannot find out, if the twig tag used in the template exist,
			// we test for throwing an (internal) twig exception during rendering of the template
			const render = function() {
				try {
					template.render({});
				} catch (e) {
					throw new Error('Pattern helper is not available');
				}
			};

			expect(render).not.toThrow();
		});

		it('has registered the placeholder helper', () => {
			const template = Twig.twig({ data: '{% placeholder name=\'inexistent\' template=\'default\' %}' });

			// since we cannot find out, if the twig tag used in the template exist,
			// we test for throwing an (internal) twig exception during rendering of the template
			const render = function() {
				try {
					template.render({});
				} catch (e) {
					throw new Error('Placeholder helper is not available');
				}
			};

			expect(render).not.toThrow();
		});

		it('has registered the viewlist helper', () => {
			const template = Twig.twig({ data: '{% viewlist %}' });

			// since we cannot find out, if the twig tag used in the template exist,
			// we test for throwing an (internal) twig exception during rendering of the template
			const render = function() {
				try {
					template.render({});
				} catch (e) {
					throw new Error('Viewlist helper is not available');
				}
			};

			expect(render).not.toThrow();
		});

		it('has registered the t helper', () => {
			const template = Twig.twig({ data: '{% t \'message.code\' data={ param=\'value\'} %}' });

			// since we cannot find out, if the twig tag used in the template exist,
			// we test for throwing an (internal) twig exception during rendering of the template
			const render = function() {
				try {
					template.render({});
				} catch (e) {
					throw new Error('T helper is not available');
				}
			};

			expect(render).not.toThrow();
		});
	});
} else {
	describe('Nitro\'s Handlebars helper loader', () => {
		it('has registered the pattern helper', () => {
			const hbs = require('../../../templating/hbs/engine');
			expect(typeof hbs.handlebars.helpers.pattern).toBe('function');
		});

		// deprecated
		it('has registered the component helper', () => {
			const hbs = require('../../../templating/hbs/engine');
			expect(typeof hbs.handlebars.helpers.component).toBe('function');
		});

		it('has registered the placeholder helper', () => {
			const hbs = require('../../../templating/hbs/engine');
			expect(typeof hbs.handlebars.helpers.placeholder).toBe('function');
		});

		it('has registered the viewlist helper', () => {
			const hbs = require('../../../templating/hbs/engine');
			expect(typeof hbs.handlebars.helpers.viewlist).toBe('function');
		});

		it('has registered the t helper', () => {
			const hbs = require('../../../templating/hbs/engine');
			expect(typeof hbs.handlebars.helpers.t).toBe('function');
		});
	});
}
