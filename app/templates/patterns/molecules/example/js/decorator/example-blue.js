(function ($) {
	'use strict';
	/**
	 * Blue decorator implementation for the Example module.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace T.Module.Example
	 * @class Blue
	 * @extends T.Module
	 * @constructor
	 */
	T.Module.Example.Blue = T.createDecorator({
		start: function (resolve) {
			var $ctx = $(this._ctx);

			console.log('Example Decorator Blue - start id: [' + $ctx.data('t-id') + ']');

			this._parent.start(resolve); // calling original method
		},
		sync: function () {
			var $ctx = $(this._ctx);

			console.log('Example Decorator Blue - sync id: [' + $ctx.data('t-id') + ']');

			this._parent.sync(); // calling original method
		}
	});
}(jQuery));
