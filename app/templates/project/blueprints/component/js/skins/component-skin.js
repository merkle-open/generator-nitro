(function($) {
	'use strict';
	/**
	 * <%= skin.name %> skin implementation for the <%= component.name %> module.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace T.Module.<%= component.js %>
	 * @class <%= skin.js %>
	 * @extends T.Module
	 */
	T.Module.<%= component.js %>.<%= skin.js %> = function(module) {
		var start = module.start.bind(module);
		module.start = function(callback) {
			var $ctx = $(this._ctx);

			start(callback); // calling original
		};
	};
}(jQuery));
