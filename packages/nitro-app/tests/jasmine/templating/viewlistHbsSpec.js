'use strict';

// const config = require('config');
const helper = require('../../../app/templating/hbs/helpers/viewlist');

describe('Hbs Viewlist Helper', () => {

	it('returns the full list', () => {
		expect(helper({ hash: {} }))
			.toMatch(`<ul><li><a href="/404">404</a></li><li><a href="/page">Page</a></li><li><a href="/test">Test</a></li></ul>`);
	});

	it('does not return "/page"', () => {
		expect(helper({ hash: { include: '404,test'} }))
			.toMatch(`<ul><li><a href="/404">404</a></li><li><a href="/test">Test</a></li></ul>`);
	});

	it('returns pages except "/test"', () => {
		expect(helper({ hash: { exclude: 'test'} }))
			.toMatch(`<ul><li><a href="/404">404</a></li><li><a href="/page">Page</a></li></ul>`);
	});

});
