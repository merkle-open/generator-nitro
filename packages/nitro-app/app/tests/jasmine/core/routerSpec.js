'use strict';

describe('Nitro Router', () => {
	const router = require('../../../core/router');

	it('contains default route', () => {
		let contains = false;

		router.stack.forEach((route) => {
			if (!!route.route && route.route.path === '/') {
				contains = true;
			}
		});

		expect(contains).toBe(true);
	});

	it('contains view route', () => {
		let contains = false;

		router.stack.forEach((route) => {
			if (!!route.route && route.route.path === '/:view') {
				contains = true;
			}
		});

		expect(contains).toBe(true);
	});

	it('contains one static route', () => {
		let noOfStaticRoutes = 0;

		router.stack.forEach(function (route) {
			if (!!route.name && route.name === 'serveStatic') {
				noOfStaticRoutes++;
			}
		});

		expect(noOfStaticRoutes).toBe(1);
	});
});
