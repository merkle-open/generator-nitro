describe('Nitro Router', function () {
	var router = require('../../app/core/router');

	it('contains default route', function () {
		var contains = false;

		router.stack.forEach(function (route) {
			if (!!route.route && route.route.path === '/') {
				contains = true;
			}
		});

		expect(contains).toBe(true);
	});

	it('contains view route', function () {
		var contains = false;

		router.stack.forEach(function (route) {
			if (!!route.route && route.route.path === '/:view') {
				contains = true;
			}
		});

		expect(contains).toBe(true);
	});

	it('contains one static routes', function () {
		var noOfStaticRoutes = 0;

		router.stack.forEach(function (route) {
			if (!!route.name && route.name === 'serveStatic') {
				noOfStaticRoutes++;
			}
		});

		expect(noOfStaticRoutes).toBe(1);
	});
});
