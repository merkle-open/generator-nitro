(function ($) {
	'use strict';
	/**
	 * Example module implementation.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace Tc.Module
	 * @class Example
	 * @extends Tc.Module
	 */
	function Example(ctx, sandbox) {
		T.Module.call(this, ctx, sandbox);
	}

	util.inherits(Example, T.Module);
	T.Module.Example = Example;

	Example.prototype.start = function(callback) {
		var $ctx = $(this._ctx);

		console.log('Example - start [id:' + $ctx.data('t-id') + ']');

		this._events.on('t.sync', this.sync.bind(this));

		callback();
	};


	Example.prototype.sync = function() {
		var $ctx = $(this._ctx);

		console.log('Example - sync [id:' + $ctx.data('t-id') + ']');
	};
}(jQuery));
