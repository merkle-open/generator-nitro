'use strict';

describe('<%= pattern.name %> module', function () {
	beforeEach(function () {
		var application = new T.Application();
		this.mod = new T.Module.<%= pattern.js %>(document.createElement('div'), application._sandbox);
	});

	it('should have a .start() method', function () {
		expect(this.mod.start).toBeDefined();
	});

	it('should execute promise.resolve callback in the .start() method', function () {
		var resolve = jasmine.createSpy('resolve');
		this.mod.start(resolve);
		expect(resolve).toHaveBeenCalled();
	});
});
