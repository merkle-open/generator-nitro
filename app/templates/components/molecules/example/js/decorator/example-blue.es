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
		start(resolve) {
			const $ctx = $(this._ctx);

			console.log(`Example Decorator Blue - start id: [${$ctx.data('t-id')}]`);

			// calling original method
			this._parent.start(resolve);
		},
		sync() {
			const $ctx = $(this._ctx);

			console.log(`Example Decorator Blue - sync id: [${$ctx.data('t-id')}]`);

			// calling original method
			this._parent.sync();
		},
	});
}(jQuery));
