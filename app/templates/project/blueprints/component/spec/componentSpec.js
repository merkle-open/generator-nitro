'use strict';

describe('<%= component.name %> module', function(){
	var mod;

	beforeEach(function(){
		var application = new T.Application();
		mod = new T.Module.<%= component.js %>(document.createElement('div'), application.sandbox);
	});

	it('should have a "start" method', function(){
		expect(mod.start).toBeDefined();
	});

	it('should execute the callback in the "start" method', function(){
		var called = false;
		spyOn(mod, 'start').and.callFake(function() {
			called = true;
		});

		expect(mod.start).toHaveBeenCalled();
		expect(called).toBeTruthy();
	});
});
