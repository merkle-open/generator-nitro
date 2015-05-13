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
	T.Module.<%= component.js %>.<%= skin.js %> = function(module) {
		var start = module.start.bind(module);
		module.start = function(callback) {
			var $ctx = $(this.ctx);

			start(callback); // calling original
		};
	};
}(Tc.$));
