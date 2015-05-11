(function($) {
	"use strict";
	/**
	 * Blue skin implementation for the Example module.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace Tc.Module.Example
	 * @class Blue
	 * @extends Tc.Module
	 * @constructor
	 */
	T.Module.Example.Blue = function(module) {
		/**
		 * Override the appropriate methods from the decorated module (ie. module.get = function()).
		 */
		var start = module.start;
		module.start = function (callback) {
			var $ctx = $(this.ctx);

			console.log('Example Skin Blue - start id:' + $ctx.data('t-id') + ']');

			start(callback); // calling original method
		};

		var sync = module.sync;
		module.sync = function() {
			var $ctx = $(this.ctx);

			console.log('Example Skin Blue - start id:' + $ctx.data('t-id') + ']');

			sync(); // calling original method
		}.bind(this);
	};
}(jQuery));
