'use strict';

describe('Ex module', () => {
	let mod;
	beforeEach(function(){
		const application = new T.Application();
		mod = new T.Module.Ex(document.createElement('div'), application._sandbox);
	});

	it('should have a .start() method', () => {
		expect(mod.start).toBeDefined();
	});

	it('should execute promise.resolve callback in the .start() method', () => {
		const resolve = jasmine.createSpy('resolve');
		mod.start(resolve);
		expect(resolve).toHaveBeenCalled();
	});
});
