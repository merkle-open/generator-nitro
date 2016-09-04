(function($) {
	'use strict';
	/**
	 * <%= pattern.name %> module implementation.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace T.Module
	 * @class <%= pattern.js %>
	 * @extends T.Module
	 */
	T.Module.<%= pattern.js %> = T.createModule({
		start: function(resolve) {
			var $ctx = $(this._ctx);

			resolve();
		}
	});
}(jQuery));
