(function($) {
	'use strict';
	/**
	 * <%= component.name %> module implementation.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace T.Module
	 * @class <%= component.js %>
	 * @extends T.Module
	 */
	T.Module.<%= component.js %> = T.createModule({
		start: function(resolve) {
			var $ctx = $(this._ctx);

			resolve();
		}
	});
}(jQuery));
