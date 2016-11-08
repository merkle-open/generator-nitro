(function ($) {
	'use strict';
	/**
	 * Example module implementation.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 * @namespace T.Module
	 * @class Example
	 * @extends T.Module
	 */
	T.Module.Example = T.createModule({
		start(resolve) {
			const $ctx = $(this._ctx);
			this._events.on('t.sync', this.sync.bind(this));

			console.log(`Example - start [id: + ${$ctx.data('t-id')} + ]`);

			resolve();
		},

		sync() {
			const $ctx = $(this._ctx);

			console.log(`Example - sync [id: + ${$ctx.data('t-id')} + ]`);
		},
	});
}(jQuery));
