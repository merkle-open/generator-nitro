(function($) {
	'use strict';
	/**
	 * <%= decorator.name %> decorator implementation for the <%= pattern.name %> module.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace T.Module.<%= pattern.js %>
	 * @class <%= decorator.js %>
	 * @extends T.Module
	 */
	T.Module.<%= pattern.js %>.<%= decorator.js %> = T.createDecorator({
		start: function (resolve) {
			var $ctx = $(this._ctx);

			this._parent.start(resolve);
		}
	});
}(jQuery));
