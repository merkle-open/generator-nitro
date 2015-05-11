describe('Nitro\'s Handlebars helper loader', function () {
	it('has registered the component helper', function () {
		var hbs = require('../../app/core/hbs');
		expect(typeof hbs.handlebars.helpers.component).toBe('function');
	});
});
