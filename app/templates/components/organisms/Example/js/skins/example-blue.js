(function($) {
	'use strict';
	/**
	 * Blue skin implementation for the Example module.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace T.Module.Example
	 * @class Blue
	 * @extends T.Module
	 * @constructor
	 */
	T.Module.Example.Blue = function(module) {
		/**
		 * Override the appropriate methods from the decorated module (ie. module.get = function()).
		 */
		var start = module.start.bind(module);
		module.start = function (callback) {
			var $ctx = $(this._ctx);

			console.log('Example Skin Blue - start id: [' + $ctx.data('t-id') + ']');

			start(callback); // calling original method
		};

		var sync = module.sync.bind(module);
		module.sync = function() {
			var $ctx = $(this._ctx);

			console.log('Example Skin Blue - sync id: [' + $ctx.data('t-id') + ']');

			sync(); // calling original method
		};
	};
}(jQuery));
