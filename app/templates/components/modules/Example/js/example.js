(function ($) {
	"use strict";
	/**
	 * Example module implementation.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace Tc.Module
	 * @class Example
	 * @extends Tc.Module
	 */
	Tc.Module.Example = Tc.Module.extend({

		// TerrificJS init (optional)
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);

			// Properties & cached jQuery-Objects for to use in different methods
			// this.prop = 'prop';
			// this.$node = this.$ctx.find('.js-node');
		},

		// TerrificJS on-phase
		on: function(callback) {
			var mod = this,
				$ctx = mod.$ctx;

			console.log('Example - on [id:' + mod.id + ']');

			callback();
		},

		// TerrificJS after-phase
		after: function() {
			var mod = this,
				$ctx = mod.$ctx;

			console.log('Example - after [id:' + mod.id + ']');
		},

		// TerrificJS example recieving method for fired events (e.g. mod.fire('do', {text:'do something'});)
		onDo: function(data) {
			var mod = this,
				$ctx = mod.$ctx;

			console.log('Example - onDo [id:' + mod.id + '] - received message: ' + data.text);
		},

		// additional example method
		_myMethod: function() {
			var mod = this,
				$ctx = mod.$ctx;

			console.log('Example - _myMethod [id:' + mod.id + ']');
		}
	});
}(Tc.$));
