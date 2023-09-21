'use strict';

// const config = require('config');
const helper = require('../../../../app/templating/hbs/helpers/viewlist');

describe('Hbs Viewlist Helper', () => {
	it('returns the full list', () => {
		expect(helper({ hash: {} })).toMatch(
			`<ul><li><a href="/404">404</a></li><li><a href="/page">Page</a></li><li><a href="/test-1">Test-1</a></li><li><a href="/test-2">Test-2</a></li><li><a href="/test-3">Test-3</a></li></ul>`
		);
	});

	it('does not return "/page"', () => {
		expect(helper({ hash: { include: '404,test-2' } })).toMatch(
			`<ul><li><a href="/404">404</a></li><li><a href="/test-2">Test-2</a></li></ul>`
		);
	});

	it('returns pages except "/test"', () => {
		expect(helper({ hash: { exclude: 'test' } })).toMatch(
			`<ul><li><a href="/404">404</a></li><li><a href="/page">Page</a></li></ul>`
		);
	});

	it('returns pages starting with "/test" except "/test-2"', () => {
		expect(helper({ hash: { include: 'test', exclude: 'test-2' } })).toMatch(
			`<ul><li><a href="/test-1">Test-1</a></li><li><a href="/test-3">Test-3</a></li></ul>`
		);
	});
});
