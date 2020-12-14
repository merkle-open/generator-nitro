'use strict';

const Twig = require('../../../app/templating/twig/engine');

describe("Nitro's Twig helper loader", () => {
	it('has registered the pattern helper', () => {
		const template = Twig.twig({ data: "{% pattern name='nonexistent' data='nonexistent' %}" });

		// since we cannot find out, if the twig tag used in the template exist,
		// we test for throwing an (internal) twig exception during rendering of the template
		const render = function () {
			try {
				template.render({});
			} catch (e) {
				throw new Error('Pattern helper is not available');
			}
		};

		expect(render).not.toThrow();
	});

	it('has registered the placeholder helper', () => {
		const template = Twig.twig({ data: "{% placeholder name='nonexistent' template='default' %}" });

		// since we cannot find out, if the twig tag used in the template exist,
		// we test for throwing an (internal) twig exception during rendering of the template
		const render = function () {
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
		const render = function () {
			try {
				template.render({});
			} catch (e) {
				throw new Error('Viewlist helper is not available');
			}
		};

		expect(render).not.toThrow();
	});

	it('has registered the t helper', () => {
		const template = Twig.twig({ data: "{% t 'message.code' data={ param='value'} %}" });

		// since we cannot find out, if the twig tag used in the template exist,
		// we test for throwing an (internal) twig exception during rendering of the template
		const render = function () {
			try {
				template.render({});
			} catch (e) {
				throw new Error('T helper is not available');
			}
		};

		expect(render).not.toThrow();
	});
});
