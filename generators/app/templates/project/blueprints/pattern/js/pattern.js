((($) => {
	'use strict';
	/**
	 * <%= pattern.name %> module implementation.
	 *
	 * @author <%= user.name %> <<%= user.email %>>
	 */

	// const selectors = { button: '.js-<%= pattern.css %>__button' };
	// const stateClasses = { disabled: 'state-<%= pattern.css %>-disabled' };

	T.Module.<%= pattern.js %> = T.createModule({
		start(resolve) {
			const $ctx = $(this._ctx);

			resolve();
		},
	});
})(jQuery));
