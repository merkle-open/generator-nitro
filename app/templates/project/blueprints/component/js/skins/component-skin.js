(function($) {
	'use strict';
	/**
	 * <%= skin.name %> skin implementation for the <%= component.name %> module.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace Tc.Module.<%= component.js %>
	 * @class <%= skin.js %>
	 * @extends Tc.Module
	 */
	Tc.Module.<%= component.js %>.<%= skin.js %> = function(module) {
		var start = module.start;

		module.start = function(callback) {
			var mod = this,
				$ctx = mod.$ctx;

			start(callback);
		};
	};
}(Tc.$));
