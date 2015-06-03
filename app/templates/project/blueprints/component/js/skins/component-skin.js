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
	T.Module.<%= component.js %>.<%= skin.js %> = T.createSkin({
		start: function (resolve) {
			var $ctx = $(this._ctx);

			this._parent.start(resolve);
		}
	});
}(jQuery));
