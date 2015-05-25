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
	function <%= component.js %>(ctx, sandbox) {
		T.Module.call(this, ctx, sandbox);
	}

	util.inherits(<%= component.js %>, T.Module);
	T.Module.<%= component.js %> = <%= component.js %>;

	<%= component.js %>.prototype.start = function(callback) {
		var $ctx = $(this.ctx);

		callback();
	};
}(jQuery));
