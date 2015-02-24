'use strict';

describe('<%= component.name %> module', function(){
	var mod;

	beforeEach(function(){
		var application = new Tc.Application();
		mod = new Tc.Module.<%= component.js %>($(), application.sandbox, 1);
	});

	it('should have an "on" method', function(){
		expect(mod.on).toBeDefined();
	});

	it('should execute the callback in the "on" method', function(){
		var called = false;
		spyOn(mod, 'on').and.callThrough();

		mod.on(function() { called = true; });

		expect(mod.on).toHaveBeenCalled();
		expect(called).toBeTruthy();
	});
});
