'use strict';

describe('Nitro\'s Handlebars helper loader', () => {
	it('has registered the pattern helper', () => {
		const hbs = require('../../app/templating/hbs/engine');
		expect(typeof hbs.handlebars.helpers.pattern).toBe('function');
	});

	it('has registered the view_list helper', () => {
		const hbs = require('../../app/templating/hbs/engine');
		expect(typeof hbs.handlebars.helpers.view_list).toBe('function');
	});

	it('has registered the t helper', () => {
		const hbs = require('../../app/templating/hbs/engine');
		expect(typeof hbs.handlebars.helpers.t).toBe('function');
	});
});
