'use strict';

describe('Nitro\'s Handlebars helper loader', () => {
	it('has registered the pattern helper', () => {
		const hbs = require('../../../templating/hbs/engine');
		expect(typeof hbs.handlebars.helpers.pattern).toBe('function');
	});

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
