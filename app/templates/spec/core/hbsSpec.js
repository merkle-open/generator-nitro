describe('Nitro\'s Handlebars helper loader', function () {
	it('has registered the component helper', function () {
		var hbs = require('../../app/core/hbs');
		expect(typeof hbs.handlebars.helpers.component).toBe('function');
	});

	it('has registered the view_list helper', function () {
		var hbs = require('../../app/core/hbs');
		expect(typeof hbs.handlebars.helpers.view_list).toBe('function');
	});

	it('has registered the t helper', function () {
		var hbs = require('../../app/core/hbs');
		expect(typeof hbs.handlebars.helpers.t).toBe('function');
	});
});
