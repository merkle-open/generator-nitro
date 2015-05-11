(function($) {
	'use strict';
	/**
	 * <%= component.name %> module implementation.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 * @namespace Tc.Module
	 * @class <%= component.js %>
	 * @extends Tc.Module
	 */
	function <%= component.js %>(ctx, sandbox) {
		T.Module.call(this, ctx, sandbox);
	}

	util.inherits(<%= component.js %>, T.Module);

	<%= component.js %>.prototype.start = function(callback) {
		var $ctx = $(this.ctx);

		callback();
	};

	T.Module.<%= component.js %> = <%= component.js %>;
}(jQuery));
